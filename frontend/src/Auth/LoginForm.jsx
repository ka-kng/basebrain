import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';


export default function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    // バリデーション
    if (!form.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[\w\-._]+@[\w\-._]+\.\w+$/.test(form.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!form.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (form.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {

      const res = await axios.post('api/login', form);

      const token = res.data.access_token;

      // トークンを保存（localStorageなど）
      localStorage.setItem('access_token', token);

      // axiosにデフォルトヘッダーとして設定
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/');

    } catch (err) {

      if (err.response && err.response.data && err.response.data.errors) {

        setErrors(err.response.data.errors);

      } else {

        setGeneralError('登録に失敗しました。時間をおいて再度お試しください。');
        console.error(err);

      }
    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center px-4 bg-gray-100">
      <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-10'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>ログイン</h1>

        <form onSubmit={handleLogin} className='mt-10 text-left flex flex-col gap-6'>


          <InputField
            label="メールアドレス"
            type='email'
            inputName="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            error={errors.email}
          />

          <InputField
            label="パスワード"
            type='password'
            inputName="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="text-center mt-4">
            <Link to="/password/forget" className="text-blue-600 hover:underline">
              パスワードを忘れた方はこちら
            </Link>
          </div>

          {errors.emailPass && <p className='text-center text-red-500'>{errors.emailPass}</p>}

          <button type="submit" className="mt-4 w-40 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg shadow-lg transition duration-300">
            ログイン
          </button>

          {generalError && (
            <p className="text-red-500 text-center">{generalError}</p>
          )}

        </form>
      </div>
    </div>
  );
};
