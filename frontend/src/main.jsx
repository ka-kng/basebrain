import axios from 'axios';
import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import './App.css'
import App from './App.jsx'
import { AuthProvider } from './Auth/AuthContext.jsx';
import './lib/axios.js'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
