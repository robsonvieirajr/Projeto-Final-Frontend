<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="header-container">
          <h1>Consulta de Açudes</h1>
          <v-btn class="btn-rounded btn-primary" @click="openModal">Cadastrar Açudes</v-btn>
        </div>

        <!-- Modal para cadastrar açudes -->
        <v-dialog v-model="dialog" max-width="600px" class="custom-dialog">
          <v-card class="custom-card">
            <v-card-title class="headline custom-card-title">Cadastrar Açude</v-card-title>
            <v-card-text>
              <v-form ref="form">
                <div class="modal-input-container">
                  <div class="modal-input">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" v-model="newAcude.nome" class="custom-input" required @input="validateForm">
                  </div>
                  <div class="modal-input">
                    <label for="localizacao">Localização</label>
                    <input type="text" id="localizacao" v-model="newAcude.localizacao" class="custom-input" required @input="validateForm">
                  </div>
                </div>
                <div class="divider"></div>
              </v-form>
            </v-card-text>
            <v-card-actions class="custom-card-actions">
              <v-spacer></v-spacer>
              <v-btn class="btn-rounded btn-outline" @click="closeModal">Cancelar</v-btn>
              <v-btn :disabled="!isFormValid" class="btn-rounded btn-primary" @click="saveAcude">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar de sucesso -->
        <v-snackbar v-model="successDialog" :timeout="timeout" color="success" class="centered-snackbar" top right>
          Açude cadastrado com sucesso!
          <v-btn color="white" text @click="closeSuccessDialog">Fechar</v-btn>
        </v-snackbar>

        <!-- Snackbar de erro -->
        <v-snackbar v-model="errorDialog" :timeout="timeout" color="error" class="centered-snackbar" top right>
          {{ errorMessage }}
          <v-btn color="white" text @click="closeErrorDialog">Fechar</v-btn>
        </v-snackbar>

        <!-- Seção de Filtros -->
        <v-card class="mb-5 custom-filter-card">
          <v-card-title class="custom-filter-title">
            <v-icon color="blue">mdi-filter</v-icon>
            Filtros
          </v-card-title>
          <v-card-text>
            <div class="filter-container">
              <div class="filter-input">
                <label for="nome">Nome</label>
                <input type="text" id="nome" v-model="filters.nome" class="custom-input">
              </div>
              <div class="filter-input">
                <label for="localizacao">Localização</label>
                <input type="text" id="localizacao" v-model="filters.localizacao" class="custom-input">
              </div>
            </div>
            <div class="filter-actions">
              <v-btn class="btn-rounded btn-primary" @click="searchAcudes">Pesquisar</v-btn>
              <v-btn class="btn-rounded btn-outline" @click="clearFilters">Limpar</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Indicador de carregamento com v-progress-linear -->
       <!-- Overlay com indicador de carregamento -->
  <div v-if="isLoading" class="overlay">
    <v-progress-circular
      indeterminate
      color="primary"
      size="50"
      width="5"
    ></v-progress-circular>
  </div>

        <!-- Tabela de Resultados -->
        <v-card v-if="isSearchPerformed && !isLoading">
          <v-card-title>
            <v-icon color="blue">mdi-clipboard-list</v-icon>
            Resultado da busca
          </v-card-title>
          <v-card-text>
            <v-data-table
              :items="pagedAcudes"
              class="elevation-1 custom-table"
              :items-per-page="itemsPerPage"
              show-expand
              hide-default-footer
            >
              <template v-slot:header>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Localização</th>
                  </tr>
                </thead>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.id }}</td>
                  <td>{{ item.nome }}</td>
                  <td>{{ item.localizacao }}</td>
                </tr>
              </template>
              <template v-slot:no-data>
  <div class="d-flex flex-column align-center justify-center" style="height: 10px;">
    <v-alert
      :value="true"
      color="transparent"
      class="text-center" 
    >
      Nenhum dado encontrado.
    </v-alert>
  </div>
</template>


            </v-data-table>
          </v-card-text>
        </v-card>

    

        <!-- Componente de Paginação -->
        <v-pagination
          v-if="isSearchPerformed && !isLoading"
          v-model="page"
          :length="pageCount"
          total-visible="7"
          color="primary"
          class="mt-4"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import acudeService from "@/service/AcudeService"; // Certifique-se de que o caminho está correto

export default {
  name: 'AcudeSearch',
  data() {
    return {
      dialog: false,
      successDialog: false,
      errorDialog: false,
      errorMessage: '',
      snackbarText: '',
      timeout: 3000,
      isFormValid: false,
      isLoading: false, // Novo estado para controle de carregamento
      isSearchPerformed: false, // Novo estado para controle de pesquisa
      newAcude: {
        nome: '',
        localizacao: ''
      },
      acudes: [], // Lista de açudes
      filteredAcudes: [], // Lista filtrada de açudes para pesquisa
      filters: {
        nome: '',
        localizacao: ''
      },
      page: 1, // Controle de paginação
      itemsPerPage: 10 // Número de itens por página
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.filteredAcudes.length / this.itemsPerPage);
    },
    pagedAcudes() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAcudes.slice(start, end);
    }
  },
  methods: {
    async fetchAcudes() {
      try {
        this.isLoading = true; // Ativar carregamento
        const response = await acudeService.getAcudes();
        this.acudes = response.objeto; // Ajuste conforme necessário para acessar a resposta correta
        this.filteredAcudes = this.acudes;
        this.isLoading = false; // Desativar carregamento
      } catch (error) {
        console.error('Erro ao buscar açudes:', error);
        this.isLoading = false; // Desativar carregamento em caso de erro
      }
    },
    async searchAcudes() {
  this.isLoading = true; // Ativar carregamento
  try {
    const response = await acudeService.getAcudes();
    this.filteredAcudes = response.objeto.filter(acude => {
      return (
        (!this.filters.nome || acude.nome.toLowerCase().includes(this.filters.nome.toLowerCase())) &&
        (!this.filters.localizacao || acude.localizacao.toLowerCase().includes(this.filters.localizacao.toLowerCase()))
      );
    });
    this.isSearchPerformed = true; // Marcar que a pesquisa foi realizada
  } catch (error) {
    console.error('Erro ao buscar açudes:', error);
    this.isSearchPerformed = true; // Marcar que a pesquisa foi realizada
  } finally {
    this.isLoading = false; // Desativar carregamento
  }
},

    clearFilters() {
      this.filters = {
        nome: '',
        localizacao: ''
      };
      this.filteredAcudes = []; // Limpar a tabela de resultados
      this.isSearchPerformed = false; // Marcar que a pesquisa não foi realizada
    },
    openModal() {
      this.dialog = true;
    },
    closeModal() {
      this.dialog = false;
      this.newAcude = { nome: '', localizacao: '' };
      this.isFormValid = false;
    },
    async saveAcude() {
      try {
        const response = await acudeService.createAcude(this.newAcude);
        console.log('Resposta da criação do açude:', response);
        if (!Array.isArray(this.acudes)) {
          this.acudes = []; // Certifique-se de que this.acudes é um array
        }
        this.acudes.push(response.objeto); // Adicione o objeto correto à lista
        this.filteredAcudes = this.acudes;
        this.showSuccessDialog();
        this.closeModal();
      } catch (error) {
        console.error('Erro ao salvar açude:', error);
        this.errorMessage = error.message || 'Erro ao criar açude';
        this.errorDialog = true;
      }
    },
    validateForm() {
      this.isFormValid = this.newAcude.nome && this.newAcude.localizacao;
    },
    showSuccessDialog() {
      this.successDialog = true;
      setTimeout(() => {
        this.closeSuccessDialog();
      }, 2000);
    },
    closeSuccessDialog() {
      this.successDialog = false;
    },
    closeErrorDialog() {
      this.errorDialog = false;
    }
  }
};
</script>

<style src="../assets/styles.css"></style>
