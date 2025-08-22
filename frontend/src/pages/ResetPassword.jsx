import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from '../components/InputField';
import { motion } from "framer-motion";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const emailQuery = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailQuery);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      await axios.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage("パスワードが更新されました。ログインページへ移動します。");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ email: "エラーが発生しました" });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="text-left space-y-3 bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
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
