// ARQUIVO: src/context/AuthContext.js
// DESCRIÇÃO: Este é o cérebro da nossa autenticação. Ele provê o estado do usuário
// para toda a aplicação de forma centralizada.

import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para verificar e carregar o usuário completo
  const checkCurrentUser = async () => {
    setIsLoading(true);
    try {
      // 1. Primeiro, verificamos se há um usuário logado e pegamos os dados básicos.
      const { username, userId } = await getCurrentUser();
      
      // 2. Se houver um usuário, buscamos seus atributos (email, nome, etc.).
      const attributes = await fetchUserAttributes();
      
      // 3. Criamos um objeto de usuário completo, combinando os dados.
      //    É este objeto que sua DashboardPage precisa!
      setUser({ username, userId, attributes });

    } catch (error) {
      // Se qualquer uma das chamadas falhar, significa que não há usuário logado.
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkCurrentUser();

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        // Usamos os eventos 'signedIn' e 'autoSignIn' que são mais comuns na v6
        case 'signedIn':
        case 'autoSignIn':
          checkCurrentUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      // O Hub listener cuidará de setar o usuário para null.
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value = {
    user,
    isLoading,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};