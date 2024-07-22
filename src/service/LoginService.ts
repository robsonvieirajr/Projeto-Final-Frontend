import apiClient from '../api/axios'; // Ajuste o caminho conforme necessário
import { LoginData } from '../model/Login'; // Ajuste o caminho conforme necessário
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/authStore';

const LoginService = {
  async login(cpf, senha) {
    try {
      const response = await apiClient.post('/usuario/login', { cpf, senha });
      if (response.status === 200) {
        const token = response.data.token; // Certifique-se de que o token está vindo do backend
        const expiresIn = 3600; // Tempo de expiração do token em segundos (2 minutos)
        const authStore = useAuthStore();
        authStore.logIn(token, expiresIn);
        return true;
      } else {
        throw new Error("Falha no login");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  async resetPassword(cpf, novaSenha) {
    try {
      const response = await apiClient.post('/usuario/redefinir-senha', { cpf, novaSenha });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
  }
};

export default LoginService;
