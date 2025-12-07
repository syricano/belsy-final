import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ModalProvider } from '@/context/ModalContext';
import { AuthContextProvider, CartProvider, LangProvider } from './context';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <AuthContextProvider>
        <CartProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </CartProvider>
      </AuthContextProvider>
    </LangProvider>
  </React.StrictMode>
);
