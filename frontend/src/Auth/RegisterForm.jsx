import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import RadioWithInput from '../components/RadioWithInput';
import BackgroudLayout from '../layout/Background';

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
      const res = await axios.post('/api/register', form);
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

    <BackgroudLayout>
      <div className='space-y-4 w-full max-w-3xl bg-white shadow-md rounded-lg p-8'>
        <h1 className='text-center mb-10 text-left text-2xl'>新規会員登録</h1>

        <form onSubmit={handleSubmit} className='text-left flex flex-col gap-5'>

          <InputField
            label="名前"
            id="name"
            inputName="name"
            value={form.name}
            onChange={handleChange}
            placeholder="田中太郎"
            error={errors.name}
          />

          <InputField
            label="メールアドレス"
            id="email"
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
            id="password"
            inputName="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <InputField
            label="パスワード確認"
            type='password'
            id="password_confirmation"
            inputName="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
          />

          <p className='text-gray-600 text-sm'>※選択に応じて下の入力欄が変わります</p>

          <RadioWithInput
            label="チームを作成したい (管理者)"
            radioValue="coach"
            selectedValue={form.role}
            onChange={() => setForm(prev => ({ ...prev, role: 'coach' }))}
            inputProps={{
              label: "チーム名",
              inputName: "team_name",
              value: form.team_name,
              onChange: handleChange,
              placeholder: "チーム名"
            }}
            error={errors.team_name}
          />

          <RadioWithInput
            label="チームに参加したい (選手)"
            radioValue="player"
            selectedValue={form.role}
            onChange={() => setForm(prev => ({ ...prev, role: 'player' }))}
            inputProps={{
              label: "招待コード",
              inputName: "invite_code",
              value: form.invite_code,
              onChange: handleChange,
              placeholder: "招待コード"
            }}
            error={errors.invite_code}
          />

          <button type="submit" className="mt-4 w-40 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg shadow-lg transition duration-300">
            登録
          </button>

          <div>
            <Link to="/login" className="text-blue-600 hover:underline">
              ログインはこちらから
            </Link>
          </div>

          {generalError && (
            <p className="text-red-500 text-center">{generalError}</p>
          )}

        </form>
      </div>
    </BackgroudLayout>
  );
};
