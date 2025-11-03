import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // アニメーション用の motion コンポーネントを読み込み
import InputField from '../components/InputField'; // 独自の入力フォームコンポーネントを読み込み

export default function ForgetPassword() { // パスワードリセット画面のコンポーネント定義
  const [email, setEmail] = useState(''); // 入力されたメールアドレスを管理
  const [message, setMessage] = useState(''); // 成功メッセージを管理
  const [errors, setErrors] = useState({}); // 入力エラーを管理

  const handleSubmit = async (e) => { // フォーム送信時の処理
    e.preventDefault(); // ページリロードを防ぐ
    setErrors({}); // 以前のエラーをリセット
    setMessage(''); // 以前のメッセージをリセット
    try {
      const res = await axios.post('/api/forgot-password', { email }); // APIにメールアドレスを送信
      setMessage(res.data.status); // 成功メッセージをセット
    } catch (err) {
      if (err.response?.data?.errors?.email) { // バリデーションエラーがあれば
        setErrors({ email: err.response.data.errors.email[0] });  // エラーメッセージをセット
      } else {
        setErrors({ email: 'エラーが発生しました' });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} // 初期アニメーション: 少し上から透明状態
      animate={{ opacity: 1, y: 0 }} // 表示時のアニメーション: 元の位置にフェードイン
      transition={{ duration: 0.5 }} // アニメーション時間0.5秒
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
    >
      <motion.form
        onSubmit={handleSubmit} // フォーム送信時にhandleSubmitを呼ぶ
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-left"
        initial={{ scale: 0.9 }} // 初期アニメーション: 少し縮小
        animate={{ scale: 1 }} // 表示時に元のサイズに戻る
        transition={{ duration: 0.3 }} // アニメーション時間0.3秒
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          パスワードリセット
        </h2>

        <InputField
          label="メールアドレス"
          type="email"
          inputName="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // 入力内容が変わったときに実行される処理
          placeholder="example@example.com"
          error={errors.email}
        />

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-left mt-3 font-medium"
          >
            {message}
          </motion.p>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 font-bold shadow-md hover:bg-blue-700 transition"
        >
          送信
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
