<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- Seção do cabeçalho -->
        <div class="header-container">
          <h1>Consulta de Açudes</h1>
          <v-btn class="btn-rounded btn-primary" @click="abrirModal"
            >Cadastrar Açudes</v-btn
          >
        </div>

        <!-- Modal para cadastrar açudes -->
        <v-dialog v-model="dialogo" max-width="600px" class="custom-dialog">
          <v-card class="custom-card">
            <v-card-title class="headline custom-card-title"
              >Cadastrar Açude</v-card-title
            >
            <v-card-text>
              <v-form ref="formulario">
                <div class="modal-input-container">
                  <div class="modal-input">
                    <label for="nome">Nome</label>
                    <input
                      type="text"
                      id="nome"
                      v-model="novoAcude.nome"
                      class="custom-input"
                      required
                      @input="validarFormulario"
                    />
                  </div>
                  <div class="modal-input">
                    <label for="localizacao">Localização</label>
                    <input
                      type="text"
                      id="localizacao"
                      v-model="novoAcude.localizacao"
                      class="custom-input"
                      required
                      @input="validarFormulario"
                    />
                  </div>
                </div>
                <div class="divider"></div>
              </v-form>
            </v-card-text>
            <v-card-actions class="custom-card-actions">
              <v-spacer></v-spacer>
              <v-btn class="btn-rounded btn-outline" @click="fecharModal"
                >Cancelar</v-btn
              >
              <v-btn
                :disabled="!formularioValido"
                class="btn-rounded btn-primary"
                @click="salvarAcude"
                >Salvar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar de sucesso -->
        <v-snackbar
          v-model="dialogoSucesso"
          :timeout="timeout"
          color="success"
          class="centered-snackbar"
          top
          right
        >
          Açude cadastrado com sucesso!
          <v-btn color="white" text @click="fecharDialogoSucesso">Fechar</v-btn>
        </v-snackbar>

        <!-- Snackbar de erro -->
        <v-snackbar
          v-model="dialogoErro"
          :timeout="timeout"
          color="error"
          class="centered-snackbar"
          top
          right
        >
          {{ mensagemErro }}
          <v-btn color="white" text @click="fecharDialogoErro">Fechar</v-btn>
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
                <input
                  type="text"
                  id="nome"
                  v-model="filtros.nome"
                  class="custom-input-nome"
                  @keyup="pesquisarAcudes"
                />
              </div>
            </div>
            <div class="filter-actions">
              <v-btn class="btn-rounded btn-primary" @click="pesquisarAcudes"
                >Pesquisar</v-btn
              >
              <v-btn class="btn-rounded btn-outline" @click="limparFiltros"
                >Limpar</v-btn
              >
            </div>
          </v-card-text>
        </v-card>

        <!-- Indicador de carregamento -->
        <div v-if="carregando" class="overlay">
          <v-progress-circular
            indeterminate
            color="primary"
            size="50"
            width="5"
          ></v-progress-circular>
        </div>

        <!-- Tabela de Resultados -->
        <v-card v-if="pesquisaRealizada && !carregando">
          <v-card-title>
            <v-icon color="blue">mdi-clipboard-list</v-icon>
            Resultado da busca
          </v-card-title>
          <v-card-text>
            <v-data-table
              :items="acudesPaginados"
              class="elevation-1 custom-table"
              :items-per-page="itensPorPagina"
              hide-default-footer
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Data Pedido</th>
                  <th>Volume Morto</th>
                  <th>Volume Acumulado</th>
                  <th>Área de Drenagem</th>
                  <th>Coeficiente de Tanque</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in acudesPaginados" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.nome }}</td>
                  <td>{{ formatarData(item.dataPedido) }}</td>
                  <td>{{ formatarNumero(item.volMorto) }}</td>
                  <td>{{ formatarNumero(item.volAcumulado) }}</td>
                  <td>{{ formatarNumero(item.areaDrenagem) }}</td>
                  <td>{{ formatarNumero(item.coeficienteTanque) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr v-if="!acudesPaginados.length">
                  <td colspan="7" class="text-center">
                    <div
                      class="d-flex flex-column align-center justify-center"
                      style="height: 10px"
                    >
                      <v-alert
                        :value="true"
                        color="light-blue"
                        class="text-center"
                        style="color: white; background-color: #e3f2fd"
                      >
                        Não foram encontrados registros correspondentes à
                        pesquisa.
                      </v-alert>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </v-data-table>
          </v-card-text>
        </v-card>

        <!-- Componente de Paginação -->
        <v-pagination
          v-if="pesquisaRealizada && !carregando"
          v-model="pagina"
          :length="totalPaginas"
          total-visible="7"
          color="primary"
          class="mt-4"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import numeral from "numeral";
import acudeService from "@/service/AcudeService";

export default {
  name: "AcudeSearch",
  data() {
    return {
      dialogo: false,
      dialogoSucesso: false,
      dialogoErro: false,
      mensagemErro: "",
      textoSnackbar: "",
      timeout: 3000,
      formularioValido: false,
      carregando: false,
      pesquisaRealizada: false,
      novoAcude: {
        nome: "",
        localizacao: "",
      },
      acudes: [],
      acudesFiltrados: [],
      filtros: {
        nome: "",
        localizacao: "",
      },
      pagina: 1,
      itensPorPagina: 10,
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.acudesFiltrados.length / this.itensPorPagina);
    },
    acudesPaginados() {
      const inicio = (this.pagina - 1) * this.itensPorPagina;
      const fim = inicio + this.itensPorPagina;
      return this.acudesFiltrados.slice(inicio, fim);
    },
  },
  methods: {
    async buscarAcudes() {
      try {
        this.carregando = true;
        const resposta = await acudeService.listarTodosAcudes();
        this.acudes = resposta.objeto;
        this.acudesFiltrados = this.acudes;
        this.carregando = false;
      } catch (erro) {
        console.error("Erro ao buscar açudes:", erro);
        this.carregando = false;
      }
    },
    async pesquisarAcudes() {
      this.carregando = true;
      setTimeout(async () => {
        try {
          const resposta = await acudeService.listarTodosAcudes();
          this.acudesFiltrados = resposta.objeto.filter((acude) => {
            return (
              (!this.filtros.nome ||
                acude.nome
                  .toLowerCase()
                  .includes(this.filtros.nome.toLowerCase())) &&
              (!this.filtros.localizacao ||
                acude.localizacao
                  .toLowerCase()
                  .includes(this.filtros.localizacao.toLowerCase()))
            );
          });
          this.pesquisaRealizada = true;
        } catch (erro) {
          console.error("Erro ao buscar açudes:", erro);
          this.pesquisaRealizada = true;
        } finally {
          this.carregando = false;
        }
      }, 3000);
    },
    limparFiltros() {
      this.filtros = {
        nome: "",
        localizacao: "",
      };
      this.acudesFiltrados = [];
      this.pesquisaRealizada = false;
    },
    abrirModal() {
      this.dialogo = true;
    },
    fecharModal() {
      this.dialogo = false;
      this.novoAcude = { nome: "", localizacao: "" };
      this.formularioValido = false;
    },
    async salvarAcude() {
      try {
        const resposta = await acudeService.criarAcude(this.novoAcude);
        if (!Array.isArray(this.acudes)) {
          this.acudes = [];
        }
        this.acudes.push(resposta.objeto);
        this.acudesFiltrados = this.acudes;
        this.mostrarDialogoSucesso();
        this.fecharModal();
      } catch (erro) {
        this.mensagemErro = "Erro ao cadastrar açude.";
        this.mostrarDialogoErro();
        console.error("Erro ao salvar açude:", erro);
      }
    },
    mostrarDialogoSucesso() {
      this.dialogoSucesso = true;
      setTimeout(() => {
        this.dialogoSucesso = false;
      }, this.timeout);
    },
    mostrarDialogoErro() {
      this.dialogoErro = true;
      setTimeout(() => {
        this.dialogoErro = false;
      }, this.timeout);
    },
    fecharDialogoSucesso() {
      this.dialogoSucesso = false;
    },
    fecharDialogoErro() {
      this.dialogoErro = false;
    },
    formatarData(data) {
      return moment(data).format("DD/MM/YYYY");
    },
    formatarNumero(numero) {
      return numeral(numero).format("0,0");
    },
    validarFormulario() {
      this.formularioValido = this.novoAcude.nome && this.novoAcude.localizacao;
    },
  },
  mounted() {
    this.buscarAcudes();
  },
};
</script>

<style src="../assets/styles.css"></style>
