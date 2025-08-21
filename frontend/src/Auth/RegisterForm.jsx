import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'player',
    team_name: '',
    invite_code: '',
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("invite");
    if (code) {
      setForm(prev => ({ ...prev, invite_code: code }));
    }
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};

    // バリデーション
    if (!form.name) {
      newErrors.name = '名前を入力してください';
    } else if (form.name.length > 100) {
      newErrors.name = '名前は100文字以内で入力してください';
    }

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

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'パスワードが一致しません';
    }

    if (form.role === 'coach') {
      if (!form.team_name) {
        newErrors.team_name = 'チーム名を入力してください';
      } else if (form.team_name.length > 100) {
        newErrors.team_name = 'チーム名は100文字以内で入力してください';
      }
    }

    if (form.role === 'player' && !form.invite_code) {
      newErrors.invite_code = '招待コードを入力してください';
    }


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {

      await axios.get('/sanctum/csrf-cookie'); // CSRFトークン取得
      const res = await axios.post('api/register', form);
      navigate('/login');

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
    <div className='min-h-screen flex justify-center items-center px-4 bg-gray-100'>
      <div className='space-y-4 w-full max-w-3xl bg-white shadow-md rounded-lg p-8'>
        <h1 className='mb-10 text-left text-2xl'>新規会員登録</h1>

        <form onSubmit={handleSubmit} className='mt-10 text-left flex flex-col gap-5'>

          <div>

            <label htmlFor='name'>名前</label>

            <input
              id='name'
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder='田中 太郎'
              className='w-full border p-2'
            />
            {errors.name && <p className='text-red-500'>{errors.name}</p>}

          </div>

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

          <div>

            <label htmlFor='password_confirmation'>パスワード確認</label>

            <input
              id='password_confirmation'
              type='password'
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder='パスワード確認'
              className='w-full border p-2'
            />

          </div>

          <div className='mt-5 flex flex-col gap-3'>

            <p>あなたはどちらですか？</p>
            <p>※選択に応じて下の入力欄が変わります</p>

          </div>

          <div className='flex flex-col gap-3'>

            <label className="flex items-center gap-2 rounded">
              <input
                type="radio"
                name="role"
                value="coach"
                checked={form.role === 'coach'}
                onChange={handleChange}
              />
              <span className="cursor-pointer">チームを作成したい（指導者・マネージャー等）</span>
            </label>

            <input
              name="team_name"
              value={form.team_name}
              onChange={handleChange}
              placeholder='チーム名'
              disabled={form.role !== 'coach'}
              className='w-full border p-2'
            />
            {errors.team_name && <p className="text-red-500">{errors.team_name}</p>}

          </div>

          <div className='flex flex-col gap-3'>

            <label className="flex items-center gap-2 rounded">
              <input
                type="radio"
                name="role"
                value="player"
                checked={form.role === 'player'}
                onChange={handleChange}
              />
              <span className="cursor-pointer">チームに参加したい（選手）</span>
            </label>

            <input
              name="invite_code"
              value={form.invite_code}
              onChange={handleChange}
              placeholder='招待コード'
              disabled={form.role !== 'player'}
              className='w-full border p-2'
            />
            {errors.invite_code && <p className="text-red-500">{errors.invite_code}</p>}

          </div>

          <button type="submit" className="mt-5 mx-auto w-40 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
            登録
          </button>

          {generalError && (
            <p className="text-red-500 text-center">{generalError}</p>
          )}

        </form>
      </div>
    </div>
  );
};
