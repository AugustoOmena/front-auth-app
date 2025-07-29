import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import { Amplify } from 'aws-amplify';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const isLocalhost = window.location.hostname === 'localhost';

const amplifyConfig = {
  Auth: {
    Cognito: {
      // O ID do seu NOVO User Pool (ex: us-east-1_XXXXXXXXX)
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,

      // O ID do seu NOVO App Client (o "MySPASucesso")
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,

      // Configuração para o login com Google
      loginWith: {
        oauth: {
          domain: process.env.REACT_APP_COGNITO_DOMAIN,
          scopes: ['profile', 'email', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: ['https://omena-delta.vercel.app/dashboard'],
          redirectSignOut: ['https://omena-delta.vercel.app'],
          responseType: 'code',
        }
      }
    }
  }
};

// Configurando a Amplify
Amplify.configure(amplifyConfig);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
