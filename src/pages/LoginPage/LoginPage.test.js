// src/pages/Login/LoginPage.test.js

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import * as AuthContext from '../../context/AuthContext';

// --- Mocks ---

const mockSignIn = jest.fn();
const mockSignInWithRedirect = jest.fn();
const mockSignUp = jest.fn();
const mockConfirmSignUp = jest.fn();
const mockResetPassword = jest.fn();
const mockConfirmResetPassword = jest.fn();

jest.mock('aws-amplify/auth', () => ({
  signIn: (args) => mockSignIn(args),
  signInWithRedirect: (args) => mockSignInWithRedirect(args),
  signUp: (args) => mockSignUp(args),
  confirmSignUp: (args) => mockConfirmSignUp(args),
  resetPassword: (args) => mockResetPassword(args),
  confirmResetPassword: (args) => mockConfirmResetPassword(args),
}));

// 2. Mockamos o hook useAuth diretamente.
// Esta é a abordagem mais robusta para isolar o componente.
const mockUseAuth = jest.spyOn(AuthContext, 'useAuth');

// --- Componente de Teste para o Dashboard ---
const DashboardTestPage = () => <div>Página do Dashboard</div>;


// --- Helper de Renderização Simplificado ---
// Agora o helper não precisa mais se preocupar com o AuthProvider.
const renderLoginPage = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardTestPage />} />
      </Routes>
    </MemoryRouter>
  );
};


// Limpa os mocks e reseta o hook para o estado padrão (deslogado) antes de cada teste.
beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({ user: null });
});

// --- Testes ---

describe('LoginPage', () => {

  // Este teste funciona, pois o estado padrão do nosso mock é `user: null`.
  it('deve renderizar o formulário de login por padrão', () => {
    renderLoginPage();
    expect(screen.getByRole('heading', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar com email/i })).toBeInTheDocument();
  });

  // --- TESTE CORRIGIDO (NOVAMENTE) ---
  it('deve redirecionar para /dashboard se o usuário já estiver logado', async () => {
    // ARRANGE: Para este teste específico, dizemos ao hook para retornar um usuário logado.
    const fakeUser = { username: 'testuser' };
    mockUseAuth.mockReturnValue({ user: fakeUser });

    // ACT: Renderizamos o componente.
    renderLoginPage();
    
    // ASSERT: Aguardamos a página do dashboard aparecer.
    expect(await screen.findByText('Página do Dashboard')).toBeInTheDocument();

    // Verificamos se o formulário de login realmente desapareceu.
    expect(screen.queryByRole('heading', { name: /entrar/i })).not.toBeInTheDocument();
  });

  describe('Fluxo de Sign In', () => {
    // Os outros testes não precisam de mudança, pois o hook já retorna `user: null` por padrão.
    it('deve chamar a função signIn da Amplify com os dados corretos ao submeter o formulário', async () => {
      renderLoginPage();
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/senha/i), 'password123');
      await user.click(screen.getByRole('button', { name: /entrar com email/i }));
      
      expect(mockSignIn).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password123',
      });
    });

    it('deve exibir uma mensagem de erro se o login falhar', async () => {
      const errorMessage = 'Usuário ou senha incorretos.';
      mockSignIn.mockRejectedValue(new Error(errorMessage));

      renderLoginPage();
      const user = userEvent.setup();
      
      await user.click(screen.getByRole('button', { name: /entrar com email/i }));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('deve chamar signInWithRedirect ao clicar no botão do Google', async () => {
        renderLoginPage();
        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: /entrar com google/i }));
        expect(mockSignInWithRedirect).toHaveBeenCalledWith({ provider: 'Google' });
    });
  });

  describe('Navegação entre views', () => {
    it('deve exibir o formulário de cadastro ao clicar em "Cadastre-se"', async () => {
      renderLoginPage();
      const user = userEvent.setup();
      await user.click(screen.getByText(/cadastre-se/i));
      expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
    });

    it('deve exibir o formulário de "Esqueceu a senha" ao clicar no link', async () => {
      renderLoginPage();
      const user = userEvent.setup();
      await user.click(screen.getByText(/esqueceu a senha/i));
      expect(screen.getByRole('heading', { name: /redefinir senha/i })).toBeInTheDocument();
    });
  });

  describe('Fluxo de Sign Up', () => {
    it('deve mudar para a view de confirmação após cadastro bem-sucedido', async () => {
        renderLoginPage();
        const user = userEvent.setup();
        await user.click(screen.getByText(/cadastre-se/i));
        await user.type(screen.getByPlaceholderText(/email/i), 'newuser@example.com');
        await user.type(screen.getByPlaceholderText(/senha/i), 'newpassword123');
        mockSignUp.mockResolvedValue({});
        await user.click(screen.getByRole('button', { name: /cadastrar/i }));
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /confirmar cadastro/i })).toBeInTheDocument();
        });
        expect(screen.getByText(/código de confirmação enviado para o seu email./i)).toBeInTheDocument();
    });
  });
});