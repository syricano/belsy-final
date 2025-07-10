import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from '@/context'; // adjust if path differs


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>    
  </React.StrictMode>
);
