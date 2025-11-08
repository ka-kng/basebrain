import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from '../components/Form/InputField';
import { motion } from "framer-motion";

// パスワード再設定ページのメイン関数
export default function ResetPassword() {
  const [searchParams] = useSearchParams(); // URLのクエリパラメータを取得するためのフックを呼び出す
  const navigate = useNavigate(); // 別ページへ移動するための関数を用意

  const token = searchParams.get("token") || ""; // URLの「token=〜」を取得（なければ空文字）
  const emailQuery = searchParams.get("email") || ""; // URLの「email=〜」を取得（なければ空文字）

  // クエリにメールがあればデコード(変換)して初期値にセット、なければ空
  const [email, setEmail] = useState(emailQuery ? decodeURIComponent(emailQuery) : "");
  const [password, setPassword] = useState(""); // 新しいパスワードを保存する変数
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // 確認用パスワードを保存する変数
  const [errors, setErrors] = useState({}); // エラー内容（入力ミスなど）を保存する
  const [message, setMessage] = useState(""); // 成功メッセージやお知らせを表示するための変数

  const handleSubmit = async (e) => {
    // フォーム送信時の処理を定義
    e.preventDefault();

    // 前回のエラーやメッセージをリセット
    setErrors({});
    setMessage("");

    try {
      // メールアドレスの前後の空白を消して、URLデコードする
      const decodedEmail = decodeURIComponent(email.trim());

      // LaravelのCSRF保護用Cookieを取得
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

      // APIにパスワードリセットリクエストを送信
      await axios.post("/api/reset-password", {
        token,
        email: decodedEmail,
        password,
        password_confirmation: passwordConfirmation,
      }, {
        withCredentials: true,
      });

      setMessage("パスワードが更新されました。ログインページへ移動します。");
      setTimeout(() => navigate("/login"), 2000); // 2秒後にログインページへ移動

    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); // APIから返されたエラー内容を表示
      } else {
        setErrors({ email: "エラーが発生しました" });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} // 最初は少し上にずらして透明にする
      animate={{ opacity: 1, y: 0 }} // 表示時にふわっと下から出てくる
      transition={{ duration: 0.5 }} // アニメーションの速さ（0.5秒）
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="text-left space-y-3 bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
        initial={{ scale: 0.9 }} // 最初は少し小さく表示
        animate={{ scale: 1 }} // 表示時にサイズが元に戻るようにする
        transition={{ duration: 0.3 }} // アニメーション時間を0.3秒に設定
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          パスワードリセット
        </h2>

        <InputField
          label="メールアドレス"
          type="email"
          inputName="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          error={errors.email}
        />

        <InputField
          label="新しいパスワード"
          type="password"
          inputName="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="新しいパスワード"
          error={errors.password}
        />

        <InputField
          label="パスワード確認"
          type="password"
          inputName="password_confirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="パスワード確認"
          error={errors.password_confirmation}
        />

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-center mt-3 font-medium"
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
          パスワードを更新
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
