import { useNavigate } from 'react-router-dom';
import { HeaderComponent } from '../../components/Header/Header'

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <HeaderComponent/>
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Bem-vindo à Página Inicial</h1>
        <p>Esta página é pública e todos podem vê-la.</p>
        <button className='button' onClick={() => navigate('/login')}>
          Entrar
        </button>
      </div>
    </div>
    
  );
};