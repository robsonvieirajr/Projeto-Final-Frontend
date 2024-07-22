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
                :maxlength="14"
                label="CPF"
                placeholder="Digite seu CPF"
                prepend-inner-icon="mdi-account"
                type="text"
                required
                outlined
                @input="onCpfInput"
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
                class="mt-3 btn-rounded btn-primary"
                @click="openResetPasswordModal"
              >Esqueceu sua senha?</v-btn>
              <v-btn type="submit" class="btn-rounded btn-primary mt-4" block depressed>ENTRAR</v-btn>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="text-center">
            <v-btn class="btn-rounded btn-primary mb-2" block>Entrar com certificado digital</v-btn>
            <v-btn class="btn-rounded btn-outline" text>Ajuda</v-btn>
            <v-btn class="btn-rounded btn-outline" text>Usuário Bloqueado?</v-btn>
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
              @input="onCpfInputReset"
            ></v-text-field>
            <v-text-field
              v-model="resetPasswordData.novaSenha"
              label="Nova Senha"
              prepend-icon="mdi-lock"
              type="password"
              required
              outlined
            ></v-text-field>
            <v-btn type="submit" class="btn-rounded btn-primary" block depressed>Redefinir</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn class="btn-rounded btn-outline" text @click="resetPasswordDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Alerta -->
    <v-dialog v-model="alertDialog" max-width="500">
      <v-card class="custom-alert-card">
        
        <v-divider class="alert-divider"></v-divider>
        <v-card-text class="alert-message custom-alert-message">
          {{ alertMessage }}
        </v-card-text>
        <v-card-actions class="alert-actions">
          <v-btn class="btn-rounded btn-primary" text @click="alertDialog = false">Fechar</v-btn>
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
const alertDialog = ref(false);
const alertMessage = ref("");

async function login() {
  if (!loginData.value.cpf || !loginData.value.senha) {
    showAlert("Por favor, preencha todos os campos!");
    return;
  }

  try {
    const success = await LoginService.login(
      loginData.value.cpf,
      loginData.value.senha
    );
    if (success) {
      router.push("/home"); // Redireciona para a rota home após o login
    }
  } catch (e) {
    console.error("Erro ao fazer login:", e);
    showAlert("CPF ou senha incorretos!");
  }
}

async function resetPassword() {
  if (!resetPasswordData.value.cpf || !resetPasswordData.value.novaSenha) {
    showAlert("Por favor, preencha todos os campos!.");
    return;
  }

  if (!isValidCPF(resetPasswordData.value.cpf)) {
    showAlert("CPF inválido.");
    return;
  }

  try {
    await LoginService.resetPassword(
      resetPasswordData.value.cpf,
      resetPasswordData.value.novaSenha
    );
    resetPasswordDialog.value = false; 
    showAlert("Senha redefinida com sucesso.");
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
      showAlert(e.response.data.message);
    } else {
      console.error("Erro ao redefinir senha:", e);
      showAlert("Erro ao redefinir senha.");
    }
  }
}

function openResetPasswordModal() {
  resetPasswordDialog.value = true;
}

function showAlert(message: string) {
  alertMessage.value = message;
  alertDialog.value = true;
}

function formatCPF(value: string) {
  let cpf = value.replace(/\D/g, '');
  if (cpf.length > 11) {
    cpf = cpf.substring(0, 11);
  }
  if (cpf.length > 9) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cpf.length > 6) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (cpf.length > 3) {
    cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }
  return cpf;
}

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11) {
    return false;
  }

  // Elimina CPFs invalidos conhecidos
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(9))) {
    return false;
  }

  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) {
    rev = 0;
  }
  if (rev != parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

function onCpfInput(event: Event) {
  const target = event.target as HTMLInputElement;
  loginData.value.cpf = formatCPF(target.value);
}

function onCpfInputReset(event: Event) {
  const target = event.target as HTMLInputElement;
  resetPasswordData.value.cpf = formatCPF(target.value);
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; 
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

.custom-alert-card {
  border-top: 10px solid #2196f3; /* Borda superior azul */
}

.custom-alert-title {
  font-weight: bold;
  color: #2196f3; /* Cor do título em azul */
}

.alert-divider {
  margin: 0;
  border: none;
  border-top: 1px solid #ddd;
}

.custom-alert-message {
  font-size: 16px;
  color: #2196f3; /* Cor da mensagem em azul */
}

.v-card-actions.alert-actions {
  justify-content: flex-end;
}

.btn-rounded {
  border-radius: 20px;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
}

.btn-outline {
  border: 1px solid #2196f3;
  color: #2196f3;
  background-color: transparent;
}

.btn-outline:hover {
  background-color: #2196f3;
  color: white;
}
</style>
