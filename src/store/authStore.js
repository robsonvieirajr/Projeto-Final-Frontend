import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!Cookies.get('token') // Verifica se o token está presente no cookie
  }),
  actions: {
    logIn() {
      this.isAuthenticated = true;
    },
    logOut() {
      this.isAuthenticated = false;
      Cookies.remove('token');
    }
  }
});
