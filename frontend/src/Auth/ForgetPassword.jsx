import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import InputField from '../components/InputField';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    try {
      const res = await axios.post('/api/forgot-password', { email });
      setMessage(res.data.status);
    } catch (err) {
      if (err.response?.data?.errors?.email) {
        setErrors({ email: err.response.data.errors.email[0] });
      } else {
        setErrors({ email: 'エラーが発生しました' });
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
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-left"
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
