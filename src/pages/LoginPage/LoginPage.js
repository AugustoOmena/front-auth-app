import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithRedirect, resetPassword, confirmResetPassword, signUp, confirmSignUp } from 'aws-amplify/auth';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ReactComponent as GoogleLogo } from '../../assets/icons/GoogleLogo.svg';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para controlar a view: 'signIn', 'signUp', 'confirmSignUp', 'forgotPassword', 'confirmResetPassword'
  const [view, setView] = useState('signIn');
  
  // Estados para os formulários
  const [email, setEmail] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Se o usuário já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signIn({ username: email, password });
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao tentar fazer login.');
    }
  };

  const handleGoogleSignIn = () => {
    signInWithRedirect({ provider: 'Google' });
  };

  const handleSignUpRequest = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    try {

      const fullName = `${givenName} ${familyName}`.trim();

      await signUp({
        username: email,
        password,
        options: { userAttributes: { email, given_name: givenName, family_name: familyName, name: fullName} }
      });
      setSuccessMessage('Código de confirmação enviado para o seu email.');
      setView('confirmSignUp');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao tentar se cadastrar.');
    }
  };

  const handleConfirmSignUp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await confirmSignUp({ username: email, confirmationCode });
      setSuccessMessage('Conta confirmada com sucesso! Você já pode fazer o login.');
      setView('signIn');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao confirmar a conta.');
    }
  };

  const handleForgotPasswordRequest = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await resetPassword({ username: email });
      setSuccessMessage('Código de confirmação enviado para o seu email.');
      setView('confirmResetPassword');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao solicitar a redefinição de senha.');
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await confirmResetPassword({ username: email, confirmationCode, newPassword });
      setSuccessMessage('Senha redefinida com sucesso! Você já pode fazer o login.');
      setView('signIn');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao redefinir a senha.');
    }
  };

  const renderSignIn = () => (
    <>
      <Link to='/'>
        <img src='./logoAI.png' alt="Ilustração de Login" className={styles.loginImage} />
      </Link>      
      <h2>Entrar</h2>
      <form onSubmit={handleSignIn}>
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={styles.input} type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <p className={styles.forgotPasswordLink} onClick={() => setView('forgotPassword')}>Esqueceu a senha?</p>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button className={styles.button} type="submit">Entrar com Email</button>
      </form>
      <div className={styles.divider}>ou</div>
      <button className={styles.googleButton} onClick={handleGoogleSignIn}>
        <GoogleLogo className={styles.googleLogo} />
        <span>Entrar com Google</span>
      </button>
      <p className={styles.signupinLink}>Não tem uma conta? <span onClick={() => setView('signUp')}>Cadastre-se</span></p>
    </>
  );

  const renderSignUp = () => (
    <>
      <Link to='/'>
        <img src='./logoAI.png' alt="Ilustração de Login" className={styles.loginImage} />
      </Link>
      <h2>Criar Conta</h2>
      <form onSubmit={handleSignUpRequest}>
        <input className={styles.input} type="text" placeholder="Nome" value={givenName} onChange={(e) => setGivenName(e.target.value)} required />
        <input className={styles.input} type="text" placeholder="Sobrenome" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required />
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={styles.input} type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit">Cadastrar</button>
      </form>
      <p className={styles.signupinLink}>Já tem uma conta? <span onClick={() => setView('signIn')}>Faça o Login</span></p>

    </>
  );

  const renderConfirmSignUp = () => (
    <>
      <h2>Confirmar Cadastro</h2>
      <p className={styles.info}>Enviamos um código para o seu email. Por favor, insira-o abaixo.</p>
      <form onSubmit={handleConfirmSignUp}>
        <input className={styles.input} type="text" placeholder="Código de Confirmação" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required />
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button className={styles.button} type="submit">Confirmar Conta</button>
      </form>
    </>
  );

  const renderForgotPassword = () => (
    <>
      <h2>Redefinir Senha</h2>
      <p className={styles.info}>Digite seu email para enviarmos um código de confirmação.</p>
      <form onSubmit={handleForgotPasswordRequest}>
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} type="submit">Enviar Código</button>
      </form>
      <p className={styles.backToSignInLink} onClick={() => setView('signIn')}>Voltar para o Login</p>
    </>
  );

  const renderConfirmResetPassword = () => (
     <>
      <h2>Confirmar Nova Senha</h2>
      <form onSubmit={handlePasswordReset}>
        <input className={styles.input} type="text" placeholder="Código de Confirmação" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required />
        <input className={styles.input} type="password" placeholder="Nova Senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button className={styles.button} type="submit">Redefinir Senha</button>
      </form>
      <p className={styles.backToSignInLink} onClick={() => setView('signIn')}>Voltar para o Login</p>
    </>
  );

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        {view === 'signIn' && renderSignIn()}
        {view === 'signUp' && renderSignUp()}
        {view === 'confirmSignUp' && renderConfirmSignUp()}
        {view === 'forgotPassword' && renderForgotPassword()}
        {view === 'confirmResetPassword' && renderConfirmResetPassword()}
      </div>
    </div>
  );
};
