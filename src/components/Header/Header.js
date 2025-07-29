// src/components/Header/Header.js

import styles from './Header.module.css'; 
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const HeaderComponent = () => {
  const defaultProfileImage = './default-profile.png';
  const { user } = useAuth();
  const isUserAuthenticated = !!user?.attributes?.picture;
  const caminhoImagem = isUserAuthenticated ? user?.attributes?.picture : defaultProfileImage;
  const caminhoLink = isUserAuthenticated ? '/dashboard' : '/login';

  return (
    <header className={styles['header-container']}> 
      <div className={styles['header-left']}>
        <Link to='/'>
          <img src='./logoAI.png' alt="Logo" className={styles['header-logo']} />
        </Link>
      </div>
      <div className={styles.headerRight}>
        <Link to={caminhoLink}>
          <img src={caminhoImagem} alt="Perfil" className={styles['header-profile-pic']} />
        </Link>
      </div>
    </header>
  );
};