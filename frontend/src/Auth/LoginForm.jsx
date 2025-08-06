import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/';

export default function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
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

      await axios.get('/sanctum/csrf-cookie'); // CSRFトークン取得
      const res = await axios.post('api/login', form);

      navigate('/dashboard');

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
      <div className='space-y-4 w-full max-w-3xl bg-white shadow-md rounded-lg p-8'>
        <h1 className='mb-10 text-left text-2xl'>ログイン</h1>

        <form onSubmit={handleSubmit} className='mt-10 text-left flex flex-col gap-5'>

          <div>

            <label htmlFor='email'>メールアドレス</label>

            <input
              id='email'
              type='email'
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder='example@example.com'
              className='w-full border p-2'
            />
            {errors.email && <p className='text-red-500'>{errors.email}</p>}
          </div>

          <div>

            <label htmlFor='password'>パスワード</label>

            <input
              id='password'
              type='password'
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder='パスワード'
              className='w-full border p-2'
            />
            {errors.password && <p className='text-red-500'>{errors.password}</p>}

          </div>

          {errors.emailPass && <p className='text-red-500'>{errors.emailPass}</p>}
          
          <button type="submit" className="mt-5 mx-auto w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
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
