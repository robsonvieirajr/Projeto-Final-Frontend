import { defineStore } from "pinia";
import Cookies from "js-cookie";
import router from "@/router"; // Ajuste o caminho conforme necessário

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: !!Cookies.get("token"),
    expirationTime: null,
    expirationChecker: null,
  }),
  actions: {
    logIn(token, expiresIn) {
      this.isAuthenticated = true;
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      Cookies.set("token", token, { expires: expirationDate });
      Cookies.set("token_expiration", expirationDate.toISOString(), {
        expires: expirationDate,
      });
      this.expirationTime = expirationDate;
      this.startTokenExpirationChecker();
    },
    logOut() {
      this.isAuthenticated = false;
      Cookies.remove("token");
      Cookies.remove("token_expiration");
      this.expirationTime = null;
      if (this.expirationChecker) {
        clearInterval(this.expirationChecker);
      }
      router.push("/login"); // Redireciona para a tela de login
    },
    startTokenExpirationChecker() {
      if (this.expirationChecker) {
        clearInterval(this.expirationChecker);
      }
      this.expirationChecker = setInterval(() => {
        if (this.expirationTime && new Date() >= this.expirationTime) {
          this.logOut();
          alert("Sua sessão expirou. Por favor, faça login novamente.");
        }
      }, 1000); // Verifica a cada segundo
    },
    checkTokenExpirationOnLoad() {
      const token = Cookies.get("token");
      if (!token) {
        this.logOut();
        return;
      }

      const expirationTime = new Date(Cookies.get("token_expiration"));
      const localExpirationTime = expirationTime.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });
      if (new Date() >= new Date(localExpirationTime)) {
        this.logOut();
      } else {
        this.isAuthenticated = true;
        this.expirationTime = new Date(localExpirationTime);
        this.startTokenExpirationChecker();
      }
    },
  },
});
