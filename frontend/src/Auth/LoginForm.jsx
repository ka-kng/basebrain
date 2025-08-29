import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setShowResend(false);

    const newErrors = {};
    if (!form.email) newErrors.email = 'メールアドレスを入力してください';
    else if (!/^[\w\-._]+@[\w\-._]+\.\w+$/.test(form.email)) newErrors.email = '有効なメールアドレスを入力してください';

    if (!form.password) newErrors.password = 'パスワードを入力してください';
    else if (form.password.length < 6) newErrors.password = 'パスワードは6文字以上で入力してください';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // CSRF クッキーを取得してからログイン
      await axios.get('/sanctum/csrf-cookie');

      const res = await axios.post('/api/login', form, { withCredentials: true });

      // user データも一緒に渡して初回から AuthContext が更新されるように
      login(res.data.access_token, res.data.user);

      navigate('/mypage');

    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {

        setErrors(data.errors);

      } else if (data?.emailPass) {

        setGeneralError(data.emailPass[0]);

      } else if (data?.emailVerified === false) {

        setGeneralError(data.message || 'メール認証が完了していません');
        setShowResend(true);

      } else {

        setGeneralError('ログインに失敗しました。時間をおいて再度お試しください。');
        console.error(err);

      }
    }

  };

  const handleResend = async () => {
    try {
      await axios.post('/api/email/resend', { email: form.email });
      setResendMessage('確認メールを再送信しました');
    } catch (err) {
      setResendMessage('再送信に失敗しました');
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">ログイン</h1>
        <form onSubmit={handleLogin} className="text-left mt-10 flex flex-col gap-6">
          <InputField label="メールアドレス" type="email" inputName="email" value={form.email} onChange={handleChange} placeholder="example@gmail.com" error={errors.email} />
          <InputField label="パスワード" type="password" inputName="password" value={form.password} onChange={handleChange} error={errors.password} />
          {errors.emailPass && <p className="text-center text-red-500">{errors.emailPass}</p>}
          {resendMessage && <p className="text-green-600 text-center">{resendMessage}</p>}
          {generalError && (
            <div className="text-center mt-2">
              <p className="text-red-500">{generalError}</p>
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
    </div>
  );
}
