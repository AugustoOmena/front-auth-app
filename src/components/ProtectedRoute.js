// DESCRIÇÃO: Este componente é o "guardião". Ele protege uma rota,
// redirecionando para o login se o usuário não estiver autenticado.

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    /*     Redireciona para a página de login, mas guarda a página que o usuário
     *    tentou acessar para que possamos redirecioná-lo de volta depois.
     */
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};