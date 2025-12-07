import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ModalProvider } from '@/context/ModalContext';
import { AuthContextProvider, CartProvider } from './context';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <CartProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </CartProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
