<template>
  <v-container class="login-container" fill-height fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-5">
          <v-card-text class="text-center">
            <img src="@/assets/aesa.png" alt="Logo" class="mb-5" width="100">
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="loginData.cpf"
                label="CPF"
                placeholder="Digite seu CPF"
                prepend-inner-icon="mdi-account"
                type="text"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="loginData.senha"
                label="Senha"
                placeholder="Digite sua senha"
                prepend-inner-icon="mdi-lock"
                type="password"
                required
                outlined
              ></v-text-field>
              <v-btn
                text
                class="mt-3"
                @click="openResetPasswordModal"
              >Esqueceu sua senha?</v-btn>
              <v-btn type="submit" color="primary" block class="mt-4" depressed>ENTRAR</v-btn>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <v-btn color="primary" block class="mb-2">Entrar com certificado digital</v-btn>
            <v-btn text>Ajuda</v-btn>
            <v-btn text>Usuário Bloqueado?</v-btn>
          </v-card-text>
          <v-card-actions>
            <v-alert v-if="error" type="error" outlined dense>{{ error }}</v-alert>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal para Redefinição de Senha -->
    <v-dialog v-model="resetPasswordDialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Redefinir Senha</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="resetPassword">
            <v-text-field
              v-model="resetPasswordData.cpf"
              label="CPF"
              prepend-icon="mdi-account"
              type="text"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="resetPasswordData.novaSenha"
              label="Nova Senha"
              prepend-icon="mdi-lock"
              type="password"
              required
              outlined
            ></v-text-field>
            <v-btn type="submit" color="primary" block depressed>Redefinir</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="resetPasswordDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import LoginService from "@/service/LoginService";
import { LoginData } from "@/model/Login";
import { useAuthStore } from "@/store/authStore";

const loginData = ref<LoginData>({ cpf: "", senha: "" });
const authStore = useAuthStore();
const router = useRouter();
const error = ref("");
const resetPasswordDialog = ref(false);
const resetPasswordData = ref({ cpf: "", novaSenha: "" });

async function login() {
  if (!loginData.value.cpf || !loginData.value.senha) {
    error.value = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    const success = await LoginService.login(
      loginData.value.cpf,
      loginData.value.senha
    );
    if (success) {
      authStore.logIn();
      router.push("/home"); // Redireciona para a rota home após o login
    }
  } catch (e) {
    console.error("Erro ao fazer login:", e);
    showError("CPF ou senha incorretos.");
  }
}

async function resetPassword() {
  if (!resetPasswordData.value.cpf || !resetPasswordData.value.novaSenha) {
    error.value = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    await LoginService.resetPassword(
      resetPasswordData.value.cpf,
      resetPasswordData.value.novaSenha
    );
    resetPasswordDialog.value = false; // Fecha o modal após a redefinição
    showError("Senha redefinida com sucesso.");
  } catch (e) {
    console.error("Erro ao redefinir senha:", e);
    showError("Erro ao redefinir senha.");
  }
}

function openResetPasswordModal() {
  resetPasswordDialog.value = true;
}

function showError(errorMessage: string) {
  error.value = errorMessage;
  setTimeout(() => {
    error.value = "";
  }, 5000); // Limpa o erro após 5 segundos
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; /* Cor de fundo claro */
}

.v-card {
  padding: 20px;
  border-radius: 10px;
}

.v-btn {
  margin-top: 10px;
}

.v-text-field {
  margin-bottom: 10px;
}
</style>
