
export default function RegisterForm() {
  const [form, setForm] = userState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'player',
    team_name: '',
    invite_code: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({...prev, [e.target.name]: e.target.value }));
  };
}
