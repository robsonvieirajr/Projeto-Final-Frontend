<template>
    <v-container class="reset-password-container" fill-height fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="teal darken-4" dark flat>
              <v-toolbar-title>Redefinir Senha</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="resetPassword">
                <v-text-field
                  v-model="resetData.cpf"
                  label="CPF"
                  prepend-icon="mdi-account"
                  type="text"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="resetData.novaSenha"
                  label="Nova Senha"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                  outlined
                ></v-text-field>
                <v-btn type="submit" color="teal darken-4" block depressed>Redefinir Senha</v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-alert v-if="error" type="error" outlined dense>{{ error }}</v-alert>
              <v-alert v-if="success" type="success" outlined dense>{{ success }}</v-alert>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import LoginService from "@/service/LoginService";
  
  const resetData = ref({ cpf: '', novaSenha: '' });
  const error = ref('');
  const success = ref('');
  
  async function resetPassword() {
    if (!resetData.value.cpf || !resetData.value.novaSenha) {
      error.value = 'Por favor, preencha todos os campos.';
      return;
    }
  
    try {
      await LoginService.resetPassword(resetData.value.cpf, resetData.value.novaSenha);
      success.value = 'Senha redefinida com sucesso.';
      error.value = '';
    } catch (e) {
      error.value = e.message;
      success.value = '';
    }
  }
  </script>
  
  <style scoped>
  .reset-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #e0f2f1; /* Cor de fundo clara combinando com o tema verde */
  }
  
  .v-card {
    border-radius: 10px; /* Borda arredondada para suavidade */
  }
  </style>
  