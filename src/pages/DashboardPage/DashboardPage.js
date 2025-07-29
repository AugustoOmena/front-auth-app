// ARQUIVO: src/pages/DashboardPage.js
// DESCRIÇÃO: A página privada, visível apenas para usuários logados.

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const defaultProfileImagePath = '/default-profile.png'; 
  const isUserAuthenticated = !!user?.attributes?.picture;
  const caminhoImagem = isUserAuthenticated ? user.attributes.picture : defaultProfileImagePath;
  const nomeUsuario = user?.attributes?.given_name || "usuário";

  return (
    <div className={styles.pageContainer}>
      <img
        src={caminhoImagem}
        alt="Foto de perfil"
        className={styles.profileImage}
      />
      
      <h1>Dashboard Secreto</h1>
      <p>Olá, {nomeUsuario}! Você está logado.</p>
      
      <div className={styles.buttonGroup}>
        <button
          onClick={() => navigate('/')}
          className="button"
        >
          Início
        </button>
        <button
          onClick={signOut}
          className="button logoutButton"
        >
          Logout
        </button>
      </div>
    </div>
  );
};