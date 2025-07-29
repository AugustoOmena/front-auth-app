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
          // O domínio que você configurou no User Pool (ex: ...amazoncognito.com)
          domain: process.env.REACT_APP_COGNITO_DOMAIN,

          scopes: ['profile', 'email', 'openid', 'aws.cognito.signin.user.admin'],

          // A URL de callback que você configurou
          redirectSignIn: [
            isLocalhost 
              ? 'http://localhost:3000/dashboard' 
              : process.env.REACT_APP_REDIRECT_SIGN_IN
          ],

          // A URL de logout que você configurou
          redirectSignOut: [
            isLocalhost 
              ? 'http://localhost:3000' 
              : process.env.REACT_APP_REDIRECT_SIGN_OUT
          ],

          responseType: 'code',
        }
      }
    }
  }
};

// 3. Configure a Amplify
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
