import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ページ遷移やリンク用の機能
import { useAuth } from './AuthContext'; // 認証状態を管理しているコンテキストを読み込み
import InputField from '../components/InputField'; // 入力欄コンポーネントを読み込み
import BackgroundLayout from '../layout/Background'; // 背景色を読み込み

export default function LoginForm() { // ログインフォームのメインコンポーネント
  const { login } = useAuth(); // AuthContext から login 関数を取得
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate(); // ページ遷移用フック

  // 入力欄が変更されたときに呼ばれる関数
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); // 入力欄の名前をキーにしてstateを更新
  };

  // ログインボタンを押したときの処理
  const handleLogin = async (e) => {
    e.preventDefault(); // ページがリロードされるのを防止
    setErrors({}); // 前回のエラーをリセット
    setGeneralError(''); // フォーム全体に関わるエラーメッセージをリセット
    setShowResend(false); // 再送信ボタンを非表示に戻す

    // 入力チェック（フロント側バリデーション）
    const newErrors = {};
    if (!form.email) newErrors.email = 'メールアドレスを入力してください';
    else if (!/^[\w\-._]+@[\w\-._]+\.\w+$/.test(form.email)) newErrors.email = '有効なメールアドレスを入力してください';

    if (!form.password) newErrors.password = 'パスワードを入力してください';
    else if (form.password.length < 6) newErrors.password = 'パスワードは6文字以上で入力してください';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // 表示して処理を中断
      return;
    }

    try {
      // Laravel Sanctum のCSRF保護のため、まずCSRFクッキーを取得
      await axios.get('/sanctum/csrf-cookie');

      // 入力情報を使ってログインAPIを呼び出す
      const res = await axios.post('/api/login', form);

      // ログイン成功：AuthContextにユーザー情報とトークンを保存
      login(res.data.access_token, res.data.user);

      // マイページに移動
      navigate('/mypage');

    } catch (err) {
      const data = err.response?.data;

      // 1. メールが未認証の場合
      if (data?.errors?.emailVerified?.[0] === false) {
        setGeneralError(data.errors.message?.[0] || 'メール認証が完了していません');
        setShowResend(true); // 再送信ボタンを表示
      }
      // 2. 入力内容のバリデーションエラー
      else if (data?.errors) {
        setErrors(data.errors);
      }
      // 3. メールまたはパスワードが違う場合
      else if (data?.emailPass) {
        setGeneralError(data.emailPass[0]);
      }
      // 4. それ以外のエラー
      else {
        setGeneralError('ログインに失敗しました。時間をおいて再度お試しください。');
        console.error(err);
      }
    }

  };

  // 認証メールの再送信ボタンを押したとき
  const handleResend = async () => {
    try {
      await axios.post('/api/email/resend', { email: form.email }); // 再送信API呼び出し
      setResendMessage('確認メールを再送信しました');
    } catch (err) {
      setResendMessage('再送信に失敗しました');
    }
  }

  return (
    <BackgroundLayout>
      <div className="space-y-4 w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">ログイン</h1>

        <form onSubmit={handleLogin} className="text-left mt-10 flex flex-col gap-6">
          <InputField label="メールアドレス" type="email" inputName="email" value={form.email} onChange={handleChange} placeholder="example@gmail.com" error={errors.email} />
          <InputField label="パスワード" type="password" inputName="password" value={form.password} onChange={handleChange} error={errors.password} />

          {/* 入力エラーやメッセージ表示 */}
          {errors.emailPass && <p className="text-center text-red-500">{errors.emailPass}</p>}
          {resendMessage && <p className="text-green-600 text-center">{resendMessage}</p>}
          {generalError && (
            <div className="text-center mt-2">
              <p className="text-red-500">{generalError}</p>
              {/* メール未認証時のみ再送信ボタンを表示 */}
              {showResend && (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue-600 hover:underline mt-2"
                >
                  メールを再送信
                </button>
              )}
            </div>
          )}

          <button type="submit" className="w-40 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg shadow-lg transition duration-300">ログイン</button>

          <div className='flex flex-col text-left text-sm gap-3'>
            <div><Link to="/password/forget" className="text-blue-600 hover:underline">パスワードを忘れた方はこちら</Link></div>
            <div><Link to="/register" className="text-blue-600 hover:underline">新規登録はこちら</Link></div>
          </div>
        </form>

      </div>
    </BackgroundLayout>
  );
}
