import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from '@/context'; 
import  AdminContextProvider  from './context/AdminProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </AdminContextProvider>    
  </React.StrictMode>
);
