import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8080';

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

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // バリデーション
    if (form.role === 'coach' && !form.team_name) {
      setErrors({ team_name: 'チーム名を入力してください' });
      return;
    }

    if (form.role === 'player' && !form.invite_code) {
      setErrors({ invite_code: '招待コードを入力してください' });
      return;
    }

    try {

      const res = await axios.post('api/register', form);
      alert('登録成功！');
      navigate('/login');

    } catch (err) {

      if (err.response && err.response.data && err.response.data.errors) {

        setErrors(err.response.data.errors);

      } else {

        alert('登録に失敗しました');
        console.error(err);

      }
    }
  };

  return (
    <div className='space-y-4 max-w-md mx-auto'>
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
            required
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
            required
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
            required
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
            required
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

        <button type="submit" className="mt-5 w-full bg-blue-500 text-white py-2 rounded">
          登録
        </button>

      </form>
    </div>
  );
};
