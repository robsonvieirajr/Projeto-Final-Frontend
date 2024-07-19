import apiClient from '../api/axios'; // Ajuste o caminho conforme necessário
import { LoginData } from '../model/Login'; // Ajuste o caminho conforme necessário
import Cookies from 'js-cookie';

const LoginService = {
  async login(cpf: string, senha: string) {
    try {
      const response = await apiClient.post('/usuario/login', { cpf, senha } as LoginData);
      if (response.status === 200) {
        // Armazena o token JWT no cookie
        Cookies.set('token', response.data.token, { expires: 7 }); // O cookie expira em 7 dias
        return true;
      } else {
        throw new Error("Falha no login");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  },

  async resetPassword(cpf: string, novaSenha: string) {
    try {
      const response = await apiClient.post('/usuario/redefinir-senha', { cpf, novaSenha });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
  }
};

export default LoginService;
