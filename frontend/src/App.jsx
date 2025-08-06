import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import RegisterForm from './Auth/RegisterForm';
import LoginForm from './Auth/LoginForm';


function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
}

export default App;
