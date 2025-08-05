import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import RegisterForm from './Auth/RegisterForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegisterForm />
    </>
  )
}

export default App
