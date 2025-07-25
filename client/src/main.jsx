import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ModalProvider } from '@/context/ModalContext';
import { AuthContextProvider } from './context';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
