import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AuthContextProvider } from '@/context';
import AdminContextProvider from './context/AdminProvider';
import { ModalProvider } from '@/context/ModalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminContextProvider>
      <AuthContextProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </AuthContextProvider>
    </AdminContextProvider>
  </React.StrictMode>
);
