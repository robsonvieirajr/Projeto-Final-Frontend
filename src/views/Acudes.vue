<template>
  <v-container>
    <v-row>
      <v-col>
        <!-- Seção do cabeçalho -->
        <div class="header-container">
          <h1>Consulta de Açudes</h1>
          <v-btn class="btn-rounded btn-primary" @click="abrirModal">Cadastrar Açudes</v-btn>
        </div>

        <!-- Modal para cadastrar açudes -->
        <v-dialog v-model="dialogo" max-width="800px" class="custom-dialog">
          <v-card class="custom-card">
            <v-card-title class="headline custom-card-title">Cadastrar Açude</v-card-title>
            <v-card-text>
              <v-form ref="formulario">
                <v-row>
                  <v-col cols="12">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" v-model="novoAcude.nome" class="custom-input" required
                      @input="validarFormulario" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <label for="volMorto">Volume Morto - VM (m³)</label>
                    <input type="number" id="volMorto" v-model="novoAcude.volumeMorto" class="custom-input" required
                      @input="validarFormulario" />
                  </v-col>
                  <v-col cols="6">
                    <label for="volAcumulado">Volume Acumulado - VA (m³)</label>
                    <input type="number" id="volAcumulado" v-model="novoAcude.volumeAcumulado" class="custom-input"
                      required @input="validarFormulario" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <label for="volMaximo">Volume Máximo - VA (m³)</label>
                    <input type="number" id="volMaximo" v-model="novoAcude.volumeMaximo" class="custom-input" required
                      @input="validarFormulario" />
                  </v-col>
                  <v-col cols="6">
                    <label for="drenagem">Área de Drenagem - A (km²)</label>
                    <input type="number" id="drenagem" v-model="novoAcude.drenagem" class="custom-input" required
                      @input="validarFormulario" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <label for="coefTanque">Coeficiente de Tanque</label>
                    <input type="number" id="coefTanque" v-model="novoAcude.coeficienteTanque" class="custom-input"
                      required @input="validarFormulario" />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="custom-card-actions">
              <v-spacer></v-spacer>
              <v-btn class="btn-rounded btn-outline" @click="fecharModal">Cancelar</v-btn>
              <v-btn :disabled="!formularioValido" class="btn-rounded btn-primary" @click="salvarAcude">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal para Importar Chuva -->
        <v-dialog v-model="dialogoChuvaImportada" max-width="1200px" class="custom-dialog">
          <v-card class="custom-card">
            <v-card-title class="headline custom-card-title">Dados de Chuva Importados</v-card-title>
            <v-card-text>
              <!-- Verifica se existem dados importados -->
              <div v-if="dadosChuvaImportados && dadosChuvaImportados.length > 0">
                <v-row>
                  <!-- Itera sobre os dados importados -->
                  <v-col v-for="(dados, index) in dadosChuvaImportados" :key="index" cols="12" sm="4" class="px-4">
                    <h3 class="custom-header">
                      Município: <strong>{{ dados.municipio }}</strong>
                    </h3>
                    <h3 class="custom-header">
                      Estação: <strong>{{ dados.estacao }}</strong>
                    </h3>
                    <!-- Itera sobre os anos mensais de dados importados -->
                    <v-row v-for="ano in dados.anosMensais" :key="ano.ano">
                      <h3 class="custom-header" style="
                          text-align: center;
                          margin-top: 30px;
                          margin-left: 50px;
                        ">
                        Ano: <strong>{{ ano.ano }}</strong>
                      </h3>
                      <!-- Adiciona um console log para verificar os dados -->
                      <div v-if="console.log(ano.dadosMensais)">
                        <!-- Confere os dados no console -->
                      </div>
                      <v-data-table :headers="[
                        { text: 'Mês', value: 'mes' },
                        { text: 'Valor (mm)', value: 'valor' },
                      ]" :items="ano.dadosMensais.map((item) => ({
                          ...item,
                          valor: `${item.valor} mm`,
                        }))
                          " hide-default-footer class="elevation-1" :items-per-page="12" dense></v-data-table>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
              <!-- Mensagem exibida caso não haja dados -->
              <div v-else>
                <p>Nenhum dado encontrado.</p>
              </div>
            </v-card-text>
            <v-card-actions class="custom-card-actions">
              <v-spacer></v-spacer>
              <div class="custom-pagination-wrapper">
                <v-pagination v-model="pagina" :length="totalPaginas" class="custom-pagination" circle></v-pagination>
              </div>
              <v-spacer></v-spacer>
              <v-btn class="btn-rounded btn-primary" style="margin-right: 10px" @click="salvarDadosChuva">Salvar</v-btn>
              <v-btn class="btn-rounded btn-outline" @click="dialogoChuvaImportada = false">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal para Dados de Chuva -->
        <v-dialog v-model="dialogoChuva" max-width="800px" class="custom-dialog">
          <v-card class="custom-card">
            <v-card-title class="headline custom-card-title">Dados de Chuva</v-card-title>
            <v-card-text>
              <v-form ref="formularioChuva">
                <v-row>
                  <!-- Seletor de Município -->
                  <v-col cols="6">
                    <label for="municipio">Município</label>
                    <v-select v-model="dadosChuva.municipio" :items="municipiosPostos
                        .map((item) => item.municipio)
                        .filter(
                          (value, index, self) =>
                            self.indexOf(value) === index
                        )
                      " label="Selecione o município" @change="atualizarPosto" required></v-select>
                  </v-col>

                  <!-- Seletor de Estação -->
                  <v-col cols="6">
                    <label for="estacao">Estação Pluviométrica</label>
                    <v-select v-model="dadosChuva.estacao" :items="postosFiltrados" label="Selecione a estação"
                      required></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <!-- Campo para Data Inicial -->
                  <v-col cols="6">
                    <label for="dataInicial">Ano Inicial</label>
                    <v-text-field v-model="dadosChuva.dataInicial" prepend-icon="mdi-calendar" placeholder="YYYY"
                      @input="formatarMesAno('dataInicial')" required></v-text-field>
                  </v-col>

                  <!-- Campo para Data Final -->
                  <v-col cols="6">
                    <label for="dataFinal">Ano Final</label>
                    <v-text-field v-model="dadosChuva.dataFinal" prepend-icon="mdi-calendar" placeholder="YYYY"
                      @input="formatarMesAno('dataFinal')" required></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <!-- Botões do Modal -->
            <v-card-actions class="custom-card-actions">
              <v-spacer></v-spacer>
              <v-btn class="btn-rounded btn-outline" @click="fecharModalChuva">Cancelar</v-btn>
              <v-btn :loading="carregando" class="btn-rounded btn-primary" @click="importarDadosChuva"
                :disabled="carregando">
                Importar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar de sucesso -->
        <v-snackbar v-model="dialogoSucesso" :timeout="timeout" color="success" top right>
          Açude cadastrado com sucesso!
          <v-btn color="white" text @click="fecharDialogoSucesso">Fechar</v-btn>
        </v-snackbar>

        <!-- Snackbar de erro -->
        <v-snackbar v-model="dialogoErro" :timeout="timeout" color="error" class="centered-snackbar" top right>
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
                <input type="text" id="nome" v-model="filtros.nome" class="custom-input-nome" />
              </div>
            </div>
            <div class="filter-actions">
              <v-btn class="btn-rounded btn-primary" @click="pesquisarAcudes">Pesquisar</v-btn>
              <v-btn class="btn-rounded btn-outline" @click="limparFiltros">Limpar</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    bottom
    right
  >
    {{ snackbarMessage }}
    <v-btn
      color="red"
      text
      @click="snackbar = false"
    >
      Fechar
    </v-btn>
  </v-snackbar>

        <!-- Indicador de carregamento -->
        <div v-if="carregando" class="overlay">
          <v-progress-circular indeterminate color="primary" size="50" width="5"></v-progress-circular>
        </div>

        <!-- Tabela de Resultados -->

        <v-card v-if="pesquisaRealizada && !carregando">
          <v-card-title>
            <v-icon color="blue">mdi-clipboard-list</v-icon>
            Resultado da busca
          </v-card-title>
          <v-card-text>
            <v-data-table :items="acudesPaginados" class="elevation-1 custom-table" :items-per-page="itensPorPagina"
              hide-default-footer>
              <thead>
                <tr>
                  <th class="text-center" width="5%">ID</th>
                  <th class="text-left" width="5%">Nome</th>
                  <th class="text-right" width="12%">Vol. Morto (m³)</th>
                  <th class="text-right" width="12%">Vol. Acumulado (m³)</th>
                  <th class="text-right" width="12%">Vol. Máx. (m³)</th>
                  <th class="text-right" width="12%">Drenagem km²</th>
                  <th class="text-right" width="12%">Coef. Tanque</th>
                  <th class="text-center" width="10%">Ações</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in acudesPaginados" :key="item.id">
                  <td class="text-center">{{ item.id }}</td>
                  <td>{{ item.nome }}</td>
                  <td class="text-right">
                    {{ formatarNumero(item.volumeMorto) }}
                  </td>
                  <td class="text-right">
                    {{ formatarNumero(item.volumeAcumulado) }}
                  </td>
                  <td class="text-right">
                    {{ formatarNumero(item.volumeMaximo) }}
                  </td>
                  <td class="text-right">
                    {{ formatarNumero(item.drenagem) }}
                  </td>
                  <td class="text-right">
                    {{ formatarNumero(item.coeficienteTanque) }}
                  </td>
                  <td class="text-center">
                    <v-icon small @click="handleClick('chuva', item)" color="blue">mdi-weather-rainy</v-icon>
                    <v-icon small @click="handleClick('vazao', item)" color="blue">mdi-waves</v-icon>
                    <v-icon small @click="handleClick('evaporacao', item)" color="blue">mdi-thermometer</v-icon>
                    <div class="icon-cav" @click="handleClick('cotaAreaVolume', item)">
                      CAV
                    </div>
                    <v-icon :style="{ fontSize: '24px' }" @click="gerarRelatorio(item)"
                      color="blue">mdi-file-pdf-box</v-icon>
                  </td>
                </tr>
              </tbody>

              <tfoot>
                <tr v-if="!acudesPaginados.length">
                  <td colspan="8" class="text-center">
                    <div class="d-flex flex-column align-center justify-center" style="height: 10px">
                      <v-alert :value="true" color="light-blue" class="text-center"
                        style="color: white; background-color: #e3f2fd">
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
        <v-pagination v-if="pesquisaRealizada && !carregando" v-model="pagina" :length="totalPaginas" total-visible="7"
          color="primary" class="mt-4"></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import moment from "moment";
import numeral from "numeral";
import acudeService from "@/service/AcudeService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import BarChart from "@/components/BarChart.vue"; // Importa o componente de gráfico
import { Alert } from "bootstrap";

export default {
  name: "AcudeSearch",
  components: {
    BarChart, // Declara o componente de gráfico
  },
  data() {
    return {
      municipiosPostos: [
        {
          id_municipio: 1,
          municipio: "Agua Branca",
          codigo: "3854072",
          posto: "Agua Branca",
        },
        {
          id_municipio: 2,
          municipio: "Aguiar",
          codigo: "3843166",
          posto: "Aguiar",
        },
        {
          id_municipio: 3,
          municipio: "Alagoa Grande",
          codigo: "3848174",
          posto: "Alagoa Grande",
        },
        {
          id_municipio: 4,
          municipio: "Alagoa Nova",
          codigo: "3848145",
          posto: "Alagoa Nova",
        },
        {
          id_municipio: 5,
          municipio: "Alagoinha",
          codigo: "3838991",
          posto: "Alagoinha",
        },
        {
          id_municipio: 6,
          municipio: "Alcantil",
          codigo: "3857493",
          posto: "Alcantil",
        },
        {
          id_municipio: 7,
          municipio: "Algodão de Jandaíra",
          codigo: "3837796",
          posto: "Algodão de Jandaíra",
        },
        {
          id_municipio: 8,
          municipio: "Alhandra",
          codigo: "3940513",
          posto: "Açude Gramame Mamuaba",
        },
        {
          id_municipio: 8,
          municipio: "Alhandra",
          codigo: "3940819",
          posto: "Alhandra",
        },
        {
          id_municipio: 9,
          municipio: "São João do Rio do Peixe",
          codigo: "3833413",
          posto: "Antenor Navarro",
        },
        {
          id_municipio: 10,
          municipio: "Amparo",
          codigo: "3855192",
          posto: "Amparo",
        },
        {
          id_municipio: 11,
          municipio: "Aparecida",
          codigo: "3833588",
          posto: "Aparecida",
        },
        {
          id_municipio: 12,
          municipio: "Araçagi",
          codigo: "3839727",
          posto: "Araçagi",
        },
        {
          id_municipio: 13,
          municipio: "Arara",
          codigo: "3838652",
          posto: "Arara",
        },
        {
          id_municipio: 14,
          municipio: "Araruna",
          codigo: "3838055",
          posto: "Araruna",
        },
        {
          id_municipio: 15,
          municipio: "Areia",
          codigo: "3838962",
          posto: "Areia",
        },
        {
          id_municipio: 16,
          municipio: "Areia de Baraúnas",
          codigo: "3846215",
          posto: "Areia de Baraúnas",
        },
        {
          id_municipio: 17,
          municipio: "Areial",
          codigo: "3848029",
          posto: "Areial",
        },
        {
          id_municipio: 18,
          municipio: "Aroeiras",
          codigo: "3858065",
          posto: "Aroeiras",
        },
        {
          id_municipio: 19,
          municipio: "Assunção",
          codigo: "3846152",
          posto: "Assunção",
        },
        {
          id_municipio: 20,
          municipio: "Baía da Traição",
          codigo: "3930312",
          posto: "Baía da Traição",
        },
        {
          id_municipio: 21,
          municipio: "Bananeiras",
          codigo: "3838575",
          posto: "Bananeiras",
        },
        {
          id_municipio: 21,
          municipio: "Bananeiras",
          codigo: "3838684",
          posto: "Vila Maia",
        },
        {
          id_municipio: 22,
          municipio: "Baraúna",
          codigo: "3837253",
          posto: "Baraúna",
        },
        {
          id_municipio: 23,
          municipio: "Barra de Santana",
          codigo: "3858002",
          posto: "Barra de Santana",
        },
        {
          id_municipio: 23,
          municipio: "Barra de Santana",
          codigo: "3858006",
          posto: "Bodocongó",
        },
        {
          id_municipio: 24,
          municipio: "Barra de Santa Rosa",
          codigo: "3837488",
          posto: "Barra de Santa Rosa",
        },
        {
          id_municipio: 25,
          municipio: "Barra de São Miguel",
          codigo: "3857534",
          posto: "Barra de São Miguel",
        },
        {
          id_municipio: 26,
          municipio: "Bayeux",
          codigo: "3940216",
          posto: "Bayeux",
        },
        {
          id_municipio: 27,
          municipio: "Belém",
          codigo: "3838494",
          posto: "Belém",
        },
        {
          id_municipio: 28,
          municipio: "Belém do Brejo do Cruz",
          codigo: "3824396",
          posto: "Belém do Brejo do Cruz",
        },
        {
          id_municipio: 29,
          municipio: "Bernardino Batista",
          codigo: "3822994",
          posto: "Bernardino Batista",
        },
        {
          id_municipio: 30,
          municipio: "Boa Ventura",
          codigo: "3843857",
          posto: "Boa Ventura",
        },
        {
          id_municipio: 31,
          municipio: "Boa Vista",
          codigo: "3847555",
          posto: "Boa Vista",
        },
        {
          id_municipio: 32,
          municipio: "Bom Jesus",
          codigo: "3832671",
          posto: "Bom Jesus",
        },
        {
          id_municipio: 33,
          municipio: "Bom Sucesso",
          codigo: "3824914",
          posto: "Bom Sucesso",
        },
        {
          id_municipio: 34,
          municipio: "Bonito de Santa Fé",
          codigo: "3842698",
          posto: "Bonito de Santa Fé",
        },
        {
          id_municipio: 35,
          municipio: "Boqueirão",
          codigo: "3847979",
          posto: "Açude Boqueirão",
        },
        {
          id_municipio: 36,
          municipio: "Igaracy",
          codigo: "3843375",
          posto: "Igaracy",
        },
        {
          id_municipio: 37,
          municipio: "Borborema",
          codigo: "3838681",
          posto: "Borborema",
        },
        {
          id_municipio: 38,
          municipio: "Brejo do Cruz",
          codigo: "3825701",
          posto: "Brejo do Cruz",
        },
        {
          id_municipio: 39,
          municipio: "Brejo dos Santos",
          codigo: "3824739",
          posto: "Brejo dos Santos",
        },
        {
          id_municipio: 40,
          municipio: "Caaporã",
          codigo: "3950017",
          posto: "Caaporã",
        },
        {
          id_municipio: 41,
          municipio: "Cabaceiras",
          codigo: "3857044",
          posto: "Cabaceiras",
        },
        {
          id_municipio: 42,
          municipio: "Cachoeira dos Índios",
          codigo: "3832868",
          posto: "Cachoeira dos Índios",
        },
        {
          id_municipio: 42,
          municipio: "Cachoeira dos Índios",
          codigo: "3832956",
          posto: "Balanços",
        },
        {
          id_municipio: 43,
          municipio: "Cacimba de Areia",
          codigo: "3845272",
          posto: "Cacimba de Areia",
        },
        {
          id_municipio: 44,
          municipio: "Cacimba de Dentro",
          codigo: "3838246",
          posto: "Cacimba de Dentro",
        },
        {
          id_municipio: 45,
          municipio: "Cacimbas",
          codigo: "3845491",
          posto: "Cacimbas",
        },
        {
          id_municipio: 46,
          municipio: "Caiçara",
          codigo: "3839208",
          posto: "Caiçara",
        },
        {
          id_municipio: 47,
          municipio: "Cajazeiras",
          codigo: "3832589",
          posto: "Açude Lagoa do Arroz",
        },
        {
          id_municipio: 47,
          municipio: "Cajazeiras",
          codigo: "",
          posto: "Sítio São José",
        },
        {
          id_municipio: 47,
          municipio: "Cajazeiras",
          codigo: "3833908",
          posto: "Açude Engenheiro Avidos",
        },
        {
          id_municipio: 47,
          municipio: "Cajazeiras",
          codigo: "3832789",
          posto: "Cajazeiras",
        },
        {
          id_municipio: 48,
          municipio: "Cajazeirinhas",
          codigo: "3834945",
          posto: "Cajazeirinhas",
        },
        {
          id_municipio: 49,
          municipio: "Caldas Brandão",
          codigo: "3849232",
          posto: "Caldas Brandão",
        },
        {
          id_municipio: 50,
          municipio: "Camalaú",
          codigo: "3856828",
          posto: "Camalaú",
        },
        {
          id_municipio: 51,
          municipio: "Campina Grande",
          codigo: "3848634",
          posto: "Sítio Massapê de Galante",
        },
        {
          id_municipio: 51,
          municipio: "Campina Grande",
          codigo: "3848318",
          posto: "INSA",
        },
        {
          id_municipio: 51,
          municipio: "Campina Grande",
          codigo: "3848537",
          posto: "Santa Terezinha",
        },
        {
          id_municipio: 51,
          municipio: "Campina Grande",
          codigo: "",
          posto: "Campina Grande-AESA",
        },
        {
          id_municipio: 51,
          municipio: "Campina Grande",
          codigo: "3848306",
          posto: "São José da Mata",
        },
        {
          id_municipio: 51,
          municipio: "Campina Grande",
          codigo: "3847686",
          posto: "Sítio Açude de Dentro",
        },
        {
          id_municipio: 51,
          municipio: "Campina Grande",
          codigo: "3848428",
          posto: "EMBRAPA",
        },
        {
          id_municipio: 52,
          municipio: "Capim",
          codigo: "3839862",
          posto: "Capim",
        },
        {
          id_municipio: 53,
          municipio: "Caraúbas",
          codigo: "3856498",
          posto: "Caraúbas",
        },
        {
          id_municipio: 54,
          municipio: "Carrapateira",
          codigo: "3843036",
          posto: "Carrapateira",
        },
        {
          id_municipio: 55,
          municipio: "Casserengue",
          codigo: "3838526",
          posto: "Sítio Salgado",
        },
        {
          id_municipio: 55,
          municipio: "Casserengue",
          codigo: "3838445",
          posto: "Casserengue",
        },
        {
          id_municipio: 56,
          municipio: "Catingueira",
          codigo: "3844279",
          posto: "Catingueira",
        },
        {
          id_municipio: 57,
          municipio: "Catolé do Rocha",
          codigo: "3824751",
          posto: "Catolé do Rocha",
        },
        {
          id_municipio: 57,
          municipio: "Catolé do Rocha",
          codigo: "3824757",
          posto: "Escola Técnica",
        },
        {
          id_municipio: 58,
          municipio: "Caturité",
          codigo: "3847898",
          posto: "Caturité",
        },
        {
          id_municipio: 58,
          municipio: "Caturité",
          codigo: "3847793",
          posto: "Fazenda Campo de Emas",
        },
        {
          id_municipio: 59,
          municipio: "Conceição",
          codigo: "3852197",
          posto: "Conceição",
        },
        {
          id_municipio: 60,
          municipio: "Condado",
          codigo: "3834877",
          posto: "Condado",
        },
        {
          id_municipio: 61,
          municipio: "Conde",
          codigo: "3940522",
          posto: "Conde",
        },
        {
          id_municipio: 62,
          municipio: "Congo",
          codigo: "3856667",
          posto: "Congo",
        },
        {
          id_municipio: 63,
          municipio: "Coremas",
          codigo: "3844008",
          posto: "Açude Coremas",
        },
        {
          id_municipio: 64,
          municipio: "Coxixola",
          codigo: "3856278",
          posto: "Coxixola",
        },
        {
          id_municipio: 65,
          municipio: "Cruz do Espírito Santo",
          codigo: "3849384",
          posto: "Cruz do Espírito Santo",
        },
        {
          id_municipio: 66,
          municipio: "Cubati",
          codigo: "3837731",
          posto: "Cubati",
        },
        {
          id_municipio: 67,
          municipio: "Cuité",
          codigo: "3827973",
          posto: "Cuité",
        },
        {
          id_municipio: 68,
          municipio: "Cuitegi",
          codigo: "3838799",
          posto: "Cuitegi",
        },
        {
          id_municipio: 69,
          municipio: "Cuité de Mamanguape",
          codigo: "3839851",
          posto: "Cuité de Mamanguape",
        },
        {
          id_municipio: 70,
          municipio: "Curral de Cima",
          codigo: "3839452",
          posto: "Curral de Cima",
        },
        {
          id_municipio: 71,
          municipio: "Curral Velho",
          codigo: "3853066",
          posto: "Curral Velho",
        },
        {
          id_municipio: 72,
          municipio: "Damião",
          codigo: "3838222",
          posto: "Damião",
        },
        {
          id_municipio: 73,
          municipio: "Desterro",
          codigo: "3845583",
          posto: "Desterro",
        },
        {
          id_municipio: 74,
          municipio: "Vista Serrana",
          codigo: "3834389",
          posto: "Desterro de Malta",
        },
        {
          id_municipio: 75,
          municipio: "Diamante",
          codigo: "3843852",
          posto: "Diamante",
        },
        {
          id_municipio: 76,
          municipio: "Dona Inês",
          codigo: "3838277",
          posto: "Dona Inês",
        },
        {
          id_municipio: 77,
          municipio: "Duas Estradas",
          codigo: "3839319",
          posto: "Duas Estradas",
        },
        {
          id_municipio: 78,
          municipio: "Emas",
          codigo: "3844261",
          posto: "Emas",
        },
        {
          id_municipio: 79,
          municipio: "Esperança",
          codigo: "3848028",
          posto: "Esperança",
        },
        {
          id_municipio: 79,
          municipio: "Esperança",
          codigo: "3838939",
          posto: "São Miguel",
        },
        {
          id_municipio: 80,
          municipio: "Fagundes",
          codigo: "3848741",
          posto: "Fagundes",
        },
        {
          id_municipio: 81,
          municipio: "Frei Martinho",
          codigo: "3827811",
          posto: "Frei Martinho",
        },
        {
          id_municipio: 82,
          municipio: "Gado Bravo",
          codigo: "3858145",
          posto: "Gado Bravo",
        },
        {
          id_municipio: 82,
          municipio: "Gado Bravo",
          codigo: "3858039",
          posto: "Fazenda Lagoa dos Marcos",
        },
        {
          id_municipio: 83,
          municipio: "Guarabira",
          codigo: "3839704",
          posto: "Guarabira",
        },
        {
          id_municipio: 84,
          municipio: "Gurinhém",
          codigo: "3849218",
          posto: "Gurinhém",
        },
        {
          id_municipio: 85,
          municipio: "Gurjão",
          codigo: "3847505",
          posto: "Gurjão",
        },
        {
          id_municipio: 86,
          municipio: "Ibiara",
          codigo: "3843919",
          posto: "Ibiara",
        },
        {
          id_municipio: 87,
          municipio: "Imaculada",
          codigo: "3845703",
          posto: "Imaculada",
        },
        {
          id_municipio: 88,
          municipio: "Ingá",
          codigo: "3848579",
          posto: "Ingá",
        },
        {
          id_municipio: 89,
          municipio: "Itabaiana",
          codigo: "3849636",
          posto: "Itabaiana",
        },
        {
          id_municipio: 90,
          municipio: "Itaporanga",
          codigo: "3843658",
          posto: "Piscicultura",
        },
        {
          id_municipio: 90,
          municipio: "Itaporanga",
          codigo: "3843667",
          posto: "Itaporanga",
        },
        {
          id_municipio: 90,
          municipio: "Itaporanga",
          codigo: "3843761",
          posto: "Fazenda Veludo",
        },
        {
          id_municipio: 91,
          municipio: "Itapororoca",
          codigo: "3839653",
          posto: "Itapororoca",
        },
        {
          id_municipio: 92,
          municipio: "Itatuba",
          codigo: "3848778",
          posto: "Itatuba",
        },
        {
          id_municipio: 93,
          municipio: "Jacaraú",
          codigo: "3839345",
          posto: "Jacaraú",
        },
        {
          id_municipio: 94,
          municipio: "Jericó",
          codigo: "3834137",
          posto: "Jericó",
        },
        {
          id_municipio: 95,
          municipio: "João Pessoa",
          codigo: "3940321",
          posto: "Mares",
        },
        {
          id_municipio: 95,
          municipio: "João Pessoa",
          codigo: "3940226",
          posto: "DFAARA",
        },
        {
          id_municipio: 95,
          municipio: "João Pessoa",
          codigo: "",
          posto: "João Pessoa",
        },
        {
          id_municipio: 95,
          municipio: "João Pessoa",
          codigo: "3940343",
          posto: "Mangabeira",
        },
        {
          id_municipio: 96,
          municipio: "Juarez Távora",
          codigo: "3848384",
          posto: "Juarez Távora",
        },
        {
          id_municipio: 97,
          municipio: "Juazeirinho",
          codigo: "3846185",
          posto: "Juazeirinho",
        },
        {
          id_municipio: 98,
          municipio: "Junco do Seridó",
          codigo: "3836963",
          posto: "Junco do Seridó",
        },
        {
          id_municipio: 99,
          municipio: "Juripiranga",
          codigo: "3849755",
          posto: "Juripiranga",
        },
        {
          id_municipio: 100,
          municipio: "Juru",
          codigo: "3854036",
          posto: "Juru",
        },
        {
          id_municipio: 101,
          municipio: "Lagoa",
          codigo: "3834217",
          posto: "Lagoa",
        },
        {
          id_municipio: 102,
          municipio: "Lagoa de Dentro",
          codigo: "3839331",
          posto: "Lagoa de Dentro",
        },
        {
          id_municipio: 103,
          municipio: "Lagoa Seca",
          codigo: "3848652",
          posto: "EMEPA",
        },
        {
          id_municipio: 103,
          municipio: "Lagoa Seca",
          codigo: "3848331",
          posto: "Lagoa Seca",
        },
        {
          id_municipio: 104,
          municipio: "Lastro",
          codigo: "3853067",
          posto: "Lastro",
        },
        {
          id_municipio: 105,
          municipio: "Livramento",
          codigo: "3846715",
          posto: "Livramento",
        },
        {
          id_municipio: 106,
          municipio: "Logradouro",
          codigo: "3839218",
          posto: "Logradouro",
        },
        {
          id_municipio: 107,
          municipio: "Lucena",
          codigo: "3930729",
          posto: "Lucena",
        },
        {
          id_municipio: 108,
          municipio: "Mãe D`Água",
          codigo: "3845514",
          posto: "Mãe D`Água",
        },
        {
          id_municipio: 109,
          municipio: "Malta",
          codigo: "3834894",
          posto: "Malta",
        },
        {
          id_municipio: 110,
          municipio: "Mamanguape",
          codigo: "3839679",
          posto: "Mamanguape",
        },
        {
          id_municipio: 110,
          municipio: "Mamanguape",
          codigo: "3839174",
          posto: "ASPLAN",
        },
        {
          id_municipio: 111,
          municipio: "Manaíra",
          codigo: "3853467",
          posto: "Manaíra",
        },
        {
          id_municipio: 112,
          municipio: "Marcação",
          codigo: "3930502",
          posto: "Marcação",
        },
        {
          id_municipio: 113,
          municipio: "Mari",
          codigo: "3849137",
          posto: "Mari",
        },
        {
          id_municipio: 114,
          municipio: "Marizópolis",
          codigo: "3833636",
          posto: "Marizópolis",
        },
        {
          id_municipio: 115,
          municipio: "Massaranduba",
          codigo: "3848355",
          posto: "Massaranduba",
        },
        {
          id_municipio: 116,
          municipio: "Mataraca",
          codigo: "3839291",
          posto: "Mataraca",
        },
        {
          id_municipio: 117,
          municipio: "Matinhas",
          codigo: "3848248",
          posto: "Matinhas",
        },
        {
          id_municipio: 118,
          municipio: "Mato Grosso",
          codigo: "3834063",
          posto: "Mato Grosso",
        },
        {
          id_municipio: 119,
          municipio: "Maturéia",
          codigo: "3845531",
          posto: "Maturéia",
        },
        {
          id_municipio: 120,
          municipio: "Mogeiro",
          codigo: "3849604",
          posto: "Mogeiro",
        },
        {
          id_municipio: 121,
          municipio: "Montadas",
          codigo: "3848214",
          posto: "Montadas",
        },
        {
          id_municipio: 122,
          municipio: "Monte Horebe",
          codigo: "3842491",
          posto: "Monte Horebe",
        },
        {
          id_municipio: 123,
          municipio: "Monteiro",
          codigo: "3856706",
          posto: "Açude Poções",
        },
        {
          id_municipio: 123,
          municipio: "Monteiro",
          codigo: "3855777",
          posto: "EMBRAPA",
        },
        {
          id_municipio: 123,
          municipio: "Monteiro",
          codigo: "3855778",
          posto: "INMET",
        },
        {
          id_municipio: 124,
          municipio: "Mulungu",
          codigo: "3849006",
          posto: "Mulungu",
        },
        {
          id_municipio: 125,
          municipio: "Natuba",
          codigo: "3858293",
          posto: "Natuba",
        },
        {
          id_municipio: 126,
          municipio: "Nazarezinho",
          codigo: "3833835",
          posto: "Nazarezinho",
        },
        {
          id_municipio: 127,
          municipio: "Nova Floresta",
          codigo: "3827961",
          posto: "Nova Floresta",
        },
        {
          id_municipio: 128,
          municipio: "Nova Olinda",
          codigo: "3843992",
          posto: "Nova Olinda",
        },
        {
          id_municipio: 129,
          municipio: "Nova Palmeira",
          codigo: "3837334",
          posto: "Poço de Pedra",
        },
        {
          id_municipio: 129,
          municipio: "Nova Palmeira",
          codigo: "3837318",
          posto: "Nova Palmeira",
        },
        {
          id_municipio: 130,
          municipio: "Olho D`Água",
          codigo: "3844448",
          posto: "Olho D`Água",
        },
        {
          id_municipio: 131,
          municipio: "Olivedos",
          codigo: "3837953",
          posto: "Olivedos",
        },
        {
          id_municipio: 132,
          municipio: "Ouro Velho",
          codigo: "3855272",
          posto: "Ouro Velho",
        },
        {
          id_municipio: 133,
          municipio: "Parari",
          codigo: "3846672",
          posto: "Parari",
        },
        {
          id_municipio: 134,
          municipio: "Passagem",
          codigo: "3845289",
          posto: "Passagem",
        },
        {
          id_municipio: 135,
          municipio: "Patos",
          codigo: "3845041",
          posto: "EMBRAPA",
        },
        {
          id_municipio: 136,
          municipio: "Paulista",
          codigo: "3834274",
          posto: "Paulista",
        },
        {
          id_municipio: 137,
          municipio: "Pedra Branca",
          codigo: "3843888",
          posto: "Pedra Branca",
        },
        {
          id_municipio: 138,
          municipio: "Pedra Lavrada",
          codigo: "3837507",
          posto: "Pedra Lavrada",
        },
        {
          id_municipio: 139,
          municipio: "Pedras de Fogo",
          codigo: "3849577",
          posto: "Campo Verde",
        },
        {
          id_municipio: 139,
          municipio: "Pedras de Fogo",
          codigo: "3849573",
          posto: "Engenho Novo I",
        },
        {
          id_municipio: 139,
          municipio: "Pedras de Fogo",
          codigo: "3849692",
          posto: "Buraco Fundo",
        },
        {
          id_municipio: 139,
          municipio: "Pedras de Fogo",
          codigo: "3849877",
          posto: "Pedras de Fogo",
        },
        {
          id_municipio: 140,
          municipio: "Piancó",
          codigo: "3844313",
          posto: "Piancó",
        },
        {
          id_municipio: 141,
          municipio: "Picuí",
          codigo: "3837028",
          posto: "Picuí",
        },
        {
          id_municipio: 142,
          municipio: "Pilar",
          codigo: "3849545",
          posto: "Pilar",
        },
        {
          id_municipio: 143,
          municipio: "Pilões",
          codigo: "3838782",
          posto: "Pilões",
        },
        {
          id_municipio: 144,
          municipio: "Pilõezinhos",
          codigo: "3838696",
          posto: "Pilõezinhos",
        },
        {
          id_municipio: 145,
          municipio: "Pirpirituba",
          codigo: "3839505",
          posto: "Pirpirituba",
        },
        {
          id_municipio: 146,
          municipio: "Pitimbu",
          codigo: "3940934",
          posto: "Pitimbu",
        },
        {
          id_municipio: 147,
          municipio: "Pocinhos",
          codigo: "3847188",
          posto: "Pocinhos",
        },
        {
          id_municipio: 148,
          municipio: "Poço Dantas",
          codigo: "3823806",
          posto: "Poço Dantas",
        },
        {
          id_municipio: 149,
          municipio: "Poço de José de Moura",
          codigo: "3833102",
          posto: "Poço de José de Moura",
        },
        {
          id_municipio: 150,
          municipio: "Pombal",
          codigo: "3834538",
          posto: "Pombal",
        },
        {
          id_municipio: 151,
          municipio: "Prata",
          codigo: "3855383",
          posto: "Prata",
        },
        {
          id_municipio: 152,
          municipio: "Princesa Isabel",
          codigo: "3853499",
          posto: "Princesa Isabel",
        },
        {
          id_municipio: 153,
          municipio: "Puxinanã",
          codigo: "3848311",
          posto: "Puxinanã",
        },
        {
          id_municipio: 154,
          municipio: "Queimadas",
          codigo: "3848724",
          posto: "Queimadas",
        },
        {
          id_municipio: 155,
          municipio: "Quixaba",
          codigo: "3845078",
          posto: "Quixaba",
        },
        {
          id_municipio: 156,
          municipio: "Remígio",
          codigo: "3838945",
          posto: "Remígio",
        },
        {
          id_municipio: 157,
          municipio: "Pedro Régis",
          codigo: "3839245",
          posto: "Pedro Régis",
        },
        {
          id_municipio: 158,
          municipio: "Riachão",
          codigo: "3838073",
          posto: "Riachão",
        },
        {
          id_municipio: 159,
          municipio: "Riachão do Bacamarte",
          codigo: "3848473",
          posto: "Riachão do Bacamarte",
        },
        {
          id_municipio: 160,
          municipio: "Riachão do Poço",
          codigo: "3849253",
          posto: "Riachão do Poço",
        },
        {
          id_municipio: 161,
          municipio: "Riacho de Santo Antônio",
          codigo: "3857471",
          posto: "Riacho de Santo Antônio",
        },
        {
          id_municipio: 162,
          municipio: "Riacho dos Cavalos",
          codigo: "3824868",
          posto: "EMEPA",
        },
        {
          id_municipio: 162,
          municipio: "Riacho dos Cavalos",
          codigo: "3824992",
          posto: "Jenipapeiro dos Carreiros",
        },
        {
          id_municipio: 163,
          municipio: "Rio Tinto",
          codigo: "3839292",
          posto: "Usina Agicam",
        },
        {
          id_municipio: 163,
          municipio: "Rio Tinto",
          codigo: "3839687",
          posto: "Rio Tinto",
        },
        {
          id_municipio: 164,
          municipio: "Salgadinho",
          codigo: "3846231",
          posto: "Salgadinho",
        },
        {
          id_municipio: 165,
          municipio: "Salgado de São Félix",
          codigo: "3849714",
          posto: "Salgado de São Félix",
        },
        {
          id_municipio: 166,
          municipio: "Santa Cecília",
          codigo: "3858429",
          posto: "Santa Cecília",
        },
        {
          id_municipio: 167,
          municipio: "Santa Cruz",
          codigo: "3833092",
          posto: "Santa Cruz",
        },
        {
          id_municipio: 168,
          municipio: "Santa Helena",
          codigo: "3832475",
          posto: "Santa Helena",
        },
        {
          id_municipio: 169,
          municipio: "Santa Inês",
          codigo: "3852292",
          posto: "Santa Inês",
        },
        {
          id_municipio: 170,
          municipio: "Santa Luzia",
          codigo: "3836916",
          posto: "Riacho do Saco",
        },
        {
          id_municipio: 170,
          municipio: "Santa Luzia",
          codigo: "3836715",
          posto: "Santa Luzia",
        },
        {
          id_municipio: 171,
          municipio: "Santana de Mangueira",
          codigo: "3853134",
          posto: "Santana de Mangueira",
        },
        {
          id_municipio: 172,
          municipio: "Santana dos Garrotes",
          codigo: "3844703",
          posto: "Santana dos Garrotes",
        },
        {
          id_municipio: 173,
          municipio: "Joca Claudino",
          codigo: "3823906",
          posto: "Santarém",
        },
        {
          id_municipio: 174,
          municipio: "Santa Rita",
          codigo: "3849498",
          posto: "Indaiá",
        },
        {
          id_municipio: 174,
          municipio: "Santa Rita",
          codigo: "3940415",
          posto: "CEDRES",
        },
        {
          id_municipio: 174,
          municipio: "Santa Rita",
          codigo: "3940206",
          posto: "Santa Rita",
        },
        {
          id_municipio: 175,
          municipio: "Santa Teresinha",
          codigo: "3845113",
          posto: "Santa Teresinha",
        },
        {
          id_municipio: 176,
          municipio: "Santo André",
          codigo: "3846475",
          posto: "Santo André",
        },
        {
          id_municipio: 177,
          municipio: "São Bento",
          codigo: "3825913",
          posto: "São Bento",
        },
        {
          id_municipio: 178,
          municipio: "São Bentinho",
          codigo: "3834759",
          posto: "São Bentinho",
        },
        {
          id_municipio: 179,
          municipio: "São Domingos do Cariri",
          codigo: "3857218",
          posto: "São Domingos do Cariri",
        },
        {
          id_municipio: 180,
          municipio: "São Domingos",
          codigo: "3834614",
          posto: "São Domingos",
        },
        {
          id_municipio: 181,
          municipio: "São Francisco",
          codigo: "3833285",
          posto: "São Francisco",
        },
        {
          id_municipio: 182,
          municipio: "São João do Cariri",
          codigo: "3846894",
          posto: "São João do Cariri",
        },
        {
          id_municipio: 183,
          municipio: "São João do Tigre",
          codigo: "3866128",
          posto: "São João do Tigre",
        },
        {
          id_municipio: 183,
          municipio: "São João do Tigre",
          codigo: "3866066",
          posto: "Santa Maria da Paraíba",
        },
        {
          id_municipio: 184,
          municipio: "São José da Lagoa Tapada",
          codigo: "3833869",
          posto: "São José da Lagoa Tapada",
        },
        {
          id_municipio: 185,
          municipio: "São José de Caiana",
          codigo: "3843544",
          posto: "São José de Caiana",
        },
        {
          id_municipio: 186,
          municipio: "São José de Espinharas",
          codigo: "3835734",
          posto: "São José de Espinharas",
        },
        {
          id_municipio: 187,
          municipio: "São José dos Ramos",
          codigo: "3849429",
          posto: "São José dos Ramos",
        },
        {
          id_municipio: 188,
          municipio: "São José de Piranhas",
          codigo: "3843202",
          posto: "São José de Piranhas",
        },
        {
          id_municipio: 188,
          municipio: "São José de Piranhas",
          codigo: "3842185",
          posto: "Sítio Arapuá",
        },
        {
          id_municipio: 189,
          municipio: "São José de Princesa",
          codigo: "3853486",
          posto: "São José de Princesa",
        },
        {
          id_municipio: 190,
          municipio: "São José do Bonfim",
          codigo: "3845341",
          posto: "São José do Bonfim",
        },
        {
          id_municipio: 191,
          municipio: "São José do Brejo do Cruz",
          codigo: "3825431",
          posto: "São José do Brejo do Cruz",
        },
        {
          id_municipio: 191,
          municipio: "São José do Brejo do Cruz",
          codigo: "3825345",
          posto: "Fazenda Espera",
        },
        {
          id_municipio: 192,
          municipio: "São José do Sabugi",
          codigo: "3836542",
          posto: "São José do Sabugi",
        },
        {
          id_municipio: 193,
          municipio: "São José dos Cordeiros",
          codigo: "3846739",
          posto: "São José dos Cordeiros",
        },
        {
          id_municipio: 194,
          municipio: "São Mamede",
          codigo: "3835882",
          posto: "São Mamede",
        },
        {
          id_municipio: 195,
          municipio: "São Miguel de Taipu",
          codigo: "3849463",
          posto: "São Miguel de Taipu",
        },
        {
          id_municipio: 196,
          municipio: "São Sebastião de Lagoa de Roça",
          codigo: "3848132",
          posto: "São Sebastião de Lagoa de Roça",
        },
        {
          id_municipio: 197,
          municipio: "São Sebastião do Umbuzeiro",
          codigo: "3865397",
          posto: "São Sebastião do Umbuzeiro",
        },
        {
          id_municipio: 198,
          municipio: "Sapé",
          codigo: "3849254",
          posto: "Sapé",
        },
        {
          id_municipio: 199,
          municipio: "São Vicente do Seridó",
          codigo: "3837829",
          posto: "São Vicente do Seridó",
        },
        {
          id_municipio: 199,
          municipio: "São Vicente do Seridó",
          codigo: "3837717",
          posto: "Seridó",
        },
        {
          id_municipio: 200,
          municipio: "Serra Branca",
          codigo: "3846969",
          posto: "Serra Branca",
        },
        {
          id_municipio: 201,
          municipio: "Serra da Raiz",
          codigo: "3839316",
          posto: "Serra da Raiz",
        },
        {
          id_municipio: 202,
          municipio: "Serra Grande",
          codigo: "3843537",
          posto: "Serra Grande",
        },
        {
          id_municipio: 203,
          municipio: "Serra Redonda",
          codigo: "3848369",
          posto: "Serra Redonda",
        },
        {
          id_municipio: 204,
          municipio: "Serraria",
          codigo: "3838675",
          posto: "Serraria",
        },
        {
          id_municipio: 205,
          municipio: "Sertãozinho",
          codigo: "3839514",
          posto: "Sertãozinho",
        },
        {
          id_municipio: 206,
          municipio: "Sobrado",
          codigo: "3849256",
          posto: "Sobrado",
        },
        {
          id_municipio: 207,
          municipio: "Solânea",
          codigo: "3838574",
          posto: "Solânea",
        },
        {
          id_municipio: 208,
          municipio: "Soledade",
          codigo: "3847128",
          posto: "Soledade",
        },
        {
          id_municipio: 208,
          municipio: "Soledade",
          codigo: "3847305",
          posto: "Fazenda Pendência",
        },
        {
          id_municipio: 209,
          municipio: "Sossêgo",
          codigo: "3837552",
          posto: "Sossêgo",
        },
        {
          id_municipio: 210,
          municipio: "Sousa",
          codigo: "3833639",
          posto: "São Gonçalo",
        },
        {
          id_municipio: 210,
          municipio: "Sousa",
          codigo: "3833554",
          posto: "Sousa",
        },
        {
          id_municipio: 210,
          municipio: "Sousa",
          codigo: "3833235",
          posto: "Sítio São Vicente",
        },
        {
          id_municipio: 211,
          municipio: "Sumé",
          codigo: "3856008",
          posto: "Fazenda Bananeiras",
        },
        {
          id_municipio: 211,
          municipio: "Sumé",
          codigo: "3856412",
          posto: "UFCG",
        },
        {
          id_municipio: 211,
          municipio: "Sumé",
          codigo: "3856314",
          posto: "Sumé",
        },
        {
          id_municipio: 212,
          municipio: "Campo de Santana",
          codigo: "3828979",
          posto: "Tacima",
        },
        {
          id_municipio: 213,
          municipio: "Taperoá",
          codigo: "3846434",
          posto: "Taperoá",
        },
        {
          id_municipio: 214,
          municipio: "Tavares",
          codigo: "3854229",
          posto: "Tavares",
        },
        {
          id_municipio: 215,
          municipio: "Teixeira",
          codigo: "3845448",
          posto: "Teixeira",
        },
        {
          id_municipio: 216,
          municipio: "Tenório",
          codigo: "3836879",
          posto: "Tenório",
        },
        {
          id_municipio: 217,
          municipio: "Triunfo",
          codigo: "3832089",
          posto: "Barra do Juá",
        },
        {
          id_municipio: 217,
          municipio: "Triunfo",
          codigo: "3832185",
          posto: "Triunfo",
        },
        {
          id_municipio: 217,
          municipio: "Triunfo",
          codigo: "3832398",
          posto: "Açude Pilões",
        },
        {
          id_municipio: 218,
          municipio: "Uiraúna",
          codigo: "3833018",
          posto: "Uiraúna",
        },
        {
          id_municipio: 219,
          municipio: "Umbuzeiro",
          codigo: "3858439",
          posto: "Mata Virgem",
        },
        {
          id_municipio: 219,
          municipio: "Umbuzeiro",
          codigo: "3858467",
          posto: "Umbuzeiro",
        },
        {
          id_municipio: 220,
          municipio: "Várzea",
          codigo: "3836505",
          posto: "Várzea",
        },
        {
          id_municipio: 221,
          municipio: "Vieirópolis",
          codigo: "3833049",
          posto: "Vieirópolis",
        },
        {
          id_municipio: 222,
          municipio: "Zabelê",
          codigo: "3865185",
          posto: "Zabelê",
        },
        {
          id_municipio: 223,
          municipio: "Cabedelo",
          codigo: "3930938",
          posto: "Cabedelo",
        },
        {
          id_municipio: 223,
          municipio: "Cabedelo",
          codigo: "3941133",
          posto: "EMATER",
        },
      ],

      dialogo: false,
      dialogoChuvaImportada: false, // controla o modal de chuva importada
      dialogoChuva: false,
      dialogoSucesso: false,
      dialogoErro: false,
      mensagemErro: "",
      textoSnackbar: "",
      snackbar: false,       // Controla a visibilidade do Snackbar
      snackbarMessage: '',   // Mensagem exibida no Snackbar
      timeout: 3000,
      formularioValido: false,
      carregando: false,
      pesquisaRealizada: false,
      novoAcude: {
        nome: "",
        volumeMorto: 0,
        volumeAcumulado: 0,
        volumeMaximo: 0,
        drenagem: 0,
        coeficienteTanque: 0,
      },
      dadosChuva: {
        municipio: null,
        estacao: null,
        dataInicial: "",
        dataFinal: "",
        codigo: null,
      },
      postosFiltrados: [],
      menuDataInicial: false, // controle do menu de Data Inicial
      menuDataFinal: false, // controle do menu de Data Final
      acudes: [],
      dadosChuvaImportados: [], // para armazenar os dados importados
      acudesFiltrados: [],
      filtros: {
        nome: "",
      },
      pagina: 1,
      itensPorPagina: 10,
      dadosDoGrafico: [], // Dados para o gráfico
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
  watch: {
    "dadosChuva.municipio"(newValue) {
      console.log("Mudança detectada no município:", newValue); // Verifique se o novo valor está sendo capturado
      this.atualizarPosto(); // Chame a função para atualizar o posto
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
    async importarDadosChuva() {
  try {
    this.carregando = true; // Ativa o estado de carregamento

    const { municipio, estacao, dataInicial, dataFinal } = this.dadosChuva;

    // Captura o idAcude da URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log("URL Params:", urlParams); // Adiciona log para inspecionar os parâmetros
    const idAcude = urlParams.get('idAcude'); // Obtém o idAcude da URL

    console.log("ID do Açude capturado:", idAcude); // Verificação do valor capturado

    if (!idAcude) {
      this.$toast.error("ID do açude não encontrado.");
      this.carregando = false;
      return;
    }

    // Envia a requisição com o idAcude incluído
    const response = await acudeService.importarChuvas(
      municipio,
      estacao,
      dataInicial,
      dataFinal,
      idAcude // Inclui o idAcude na requisição
    );

    // Verifica se há dados e define os dados no frontend
    if (response && response.objeto && response.objeto.length > 0) {
      this.dadosChuvaImportados = response.objeto;
      console.log("Dados de chuva importados:", this.dadosChuvaImportados); // Verificação dos dados
      
      // Aqui você abre o modal de importação dos dados, caso precise
      this.dialogoChuvaImportada = true;

      // Fechar o modal de importação ao final do processo
      this.dialogoChuva = false; // Fecha o modal principal de importação
    } else {
      this.$toast.error("Nenhum dado retornado.");
    }
  } catch (error) {
    console.error("Erro ao importar os dados de chuva:", error);
    this.$toast.error("Erro ao importar os dados de chuva.");
  } finally {
    this.carregando = false; // Desativa o estado de carregamento após a conclusão
  }
},


    atualizarPosto() {
      console.log("Município selecionado:", this.dadosChuva.municipio);
      console.log("Lista de municípios:", this.municipiosPostos);

      const municipioSelecionado = this.dadosChuva.municipio;

      // Verifique se o município foi selecionado corretamente
      if (!municipioSelecionado) {
        console.error("Município não selecionado corretamente.");
        return;
      }

      // Filtrar os postos correspondentes ao município selecionado
      this.postosFiltrados = this.municipiosPostos
        .filter(
          (item) =>
            item.municipio.trim().toLowerCase() ===
            municipioSelecionado.trim().toLowerCase()
        )
        .map((item) => item.posto);

      console.log(
        "Postos disponíveis para o município selecionado:",
        this.postosFiltrados

      );

      // Limpar o campo de estação para forçar o usuário a escolher um novo posto
      this.dadosChuva.estacao = null;

     
      
    },

    handleClick(acao, item) {
      if (acao === "chuva") {
        this.dialogoChuva = true; // Abre o modal
        this.dadosChuva.municipio = item.municipio; // Preenche o município com o valor do item
        this.idAcude = item.id; // Captura o ID do açude

        // Adiciona o ID do açude na URL
        const url = new URL(window.location.href);
        url.searchParams.set('idAcude', this.idAcude);
        window.history.pushState({}, '', url); // Atualiza a URL sem recarregar a página

        this.atualizarPosto(); // Atualiza a estação pluviométrica com base no município selecionado
      }
    },

    async salvarDadosChuva() {
    // Verifique se há dados para salvar
    if (!this.dadosChuvaImportados || this.dadosChuvaImportados.length === 0) {
      this.$toast.error("Nenhum dado de chuva para salvar.");
      return;
    }

    // Obtenha o idAcude da URL ou de onde ele estiver armazenado
    const idAcude = this.$route.query.idAcude; // Verificar se o idAcude está na URL

    // // Se o idAcude estiver indefinido, exiba uma mensagem de erro
    // if (!idAcude) {
    //   this.$toast.error("ID do Açude não encontrado.");
    //   return;
    // }

    // Log para verificar o ID do Açude
    console.log("ID do Açude:", idAcude);

    // Prepare os dados no formato esperado pelo backend
    const dadosParaSalvar = this.dadosChuvaImportados.map(dado => ({
      idAcude: idAcude, // Usar o idAcude obtido da URL
      municipio: dado.municipio,
      estacao: dado.estacao,
      anosMensais: dado.anosMensais.map(ano => ({
        ano: ano.ano,
        chuvaPorMes: ano.dadosMensais.reduce((acc, item) => {
          acc[item.mes] = parseFloat(String(item.valor).replace(' mm', '')); // Corrigir o formato dos valores
          return acc;
        }, {}),
      })),
    }));

    // Verifique os dados que serão enviados ao backend
    console.log("Dados para salvar:", dadosParaSalvar);

    try {
      // Chama o serviço para salvar os dados de chuva no backend
      const response = await acudeService.salvarChuvas(dadosParaSalvar);

      // Exibe o Snackbar personalizado com a mensagem de sucesso
      this.snackbarMessage = "Dados de chuva foram salvos com sucesso!";
      this.snackbar = true;

      // Fechar o modal após salvar com sucesso
      this.dialogoChuvaImportada = false;

      // Forçar a atualização da interface para garantir que o modal feche
      this.$forceUpdate();

    } catch (error) {
      console.error("Erro ao salvar os dados de chuva:", error);

      // Tratamento para casos em que a resposta de erro não possui a estrutura esperada
      if (error.response && error.response.data && error.response.data.message) {
        this.$toast.error(error.response.data.message);
      } else {
        this.$toast.error("Erro ao salvar os dados de chuva.");
      }
    }
  },


    async pesquisarAcudes() {
      this.carregando = true;
      setTimeout(async () => {
        try {
          const resposta = await acudeService.listarTodosAcudes();
          this.acudesFiltrados = resposta.objeto.filter((acude) => {
            return (
              !this.filtros.nome ||
              acude.nome.toLowerCase().includes(this.filtros.nome.toLowerCase())
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
      };
      this.acudesFiltrados = [];
      this.pesquisaRealizada = false;
    },
    abrirModal() {
      this.dialogo = true;
    },
    fecharModal() {
      this.dialogo = false;
      this.novoAcude = {
        nome: "",
        volumeMorto: 0,
        volumeAcumulado: 0,
        volumeMaximo: 0,
        drenagem: 0,
        coeficienteTanque: 0,
      };
      this.formularioValido = false;
    },
    async salvarAcude() {
      try {
        const resposta = await acudeService.createAcude(this.novoAcude);
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
      return numeral(numero).format("0,0.00");
    },
    validarFormulario() {
      this.formularioValido =
        this.novoAcude.nome &&
        this.novoAcude.volumeMorto !== null &&
        this.novoAcude.volumeAcumulado !== null &&
        this.novoAcude.volumeMaximo !== null &&
        this.novoAcude.drenagem !== null &&
        this.novoAcude.coeficienteTanque !== null;
    },
    handleClick(acao, item) {
      if (acao === "chuva") {
        this.dialogoChuva = true; // Abre o modal
        this.dadosChuva.municipio = item.municipio; // Preenche o município com o valor do item
        this.idAcude = item.id; // Captura o ID do açude

        // Adiciona o ID do açude na URL
        const url = new URL(window.location.href);
        url.searchParams.set('idAcude', this.idAcude);
        window.history.pushState({}, '', url); // Atualiza a URL sem recarregar a página

        this.atualizarPosto(); // Atualiza a estação pluviométrica com base no município selecionado
      }
    },

    fecharModalChuva() {
      this.dialogoChuva = false;
      this.dadosChuva = {
        municipio: "",
        estacao: "",
        dataInicial: null,
        dataFinal: null,
      };
    },

    async gerarRelatorio(item) {
      this.$nextTick(async () => {
        const doc = new jsPDF("p", "mm", "a4");

        // Adiciona um cabeçalho com logo e data
        const logoUrl = "src/assets/aesa.png"; // URL da sua logo
        doc.addImage(logoUrl, "PNG", 15, 15, 15, 15); // Adiciona a logo
        doc.setFontSize(10);
        doc.text(
          `Data do Relatório: ${new Date().toLocaleDateString()}`,
          160,
          15,
          { align: "right" }
        );

        // Adiciona um título com centralização e formatação
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório do Açude", 105, 40, { align: "center" });

        // Adiciona uma linha abaixo do título
        doc.setLineWidth(0.5);
        doc.line(14, 45, 196, 45);

        // Adiciona os dados básicos do relatório com alinhamento e espaçamento melhorados
        doc.setFontSize(12);
        const margemEsquerda = 20;
        const espacamentoLinhas = 10;
        let posY = 60;

        const campos = [
          { label: "Nome:", value: item.nome },
          { label: "Volume Morto:", value: `${item.volumeMorto} m³` },
          { label: "Volume Acumulado:", value: `${item.volumeAcumulado} m³` },
          { label: "Volume Máximo:", value: `${item.volumeMaximo} m³` },
          { label: "Drenagem:", value: `${item.drenagem} km²` },
          {
            label: "Coeficiente de Tanque:",
            value: item.coeficienteTanque.toString(),
          }, // Convertendo para string
        ];

        campos.forEach((campo) => {
          doc.setFont("helvetica", "bold");
          doc.text(campo.label, margemEsquerda, posY);
          doc.setFont("helvetica", "normal");
          doc.text(campo.value.toString(), margemEsquerda + 50, posY); // Garantindo que seja string
          posY += espacamentoLinhas;
        });

        // Adiciona o título do gráfico
        posY += 15;
        doc.setFont("helvetica", "bold");
        doc.text("Gráfico de Medições do Açude", 105, posY, {
          align: "center",
        });

        // Adiciona o gráfico manualmente
        let chartX = 20;
        let chartY = posY + 10;
        let chartWidth = 150;
        let chartHeight = 60;

        const valores = [
          item.volumeMorto,
          item.volumeAcumulado,
          item.volumeMaximo,
          item.drenagem,
          item.coeficienteTanque,
        ];
        const labels = [
          "Vol. Morto",
          "Vol. Acum.",
          "Vol. Máx.",
          "Drenagem",
          "Coef. Tanque",
        ];

        // Desenha as linhas de grade
        let maxValue = Math.max(...valores);
        const numLines = 5;
        for (let i = 0; i <= numLines; i++) {
          let lineY = chartY + (i * chartHeight) / numLines;
          let valueLabel = Math.round(maxValue - (i * maxValue) / numLines);
          doc.setLineWidth(0.1);
          doc.setDrawColor(180); // Cor mais clara para a grade
          doc.line(chartX, lineY, chartX + chartWidth, lineY); // Linha horizontal
          doc.setFontSize(8);
          doc.setTextColor(0);
          doc.text(valueLabel.toString(), chartX - 10, lineY + 3); // Valor na linha
        }

        // Desenha as barras
        valores.forEach((valor, index) => {
          let barHeight = (valor / maxValue) * chartHeight;
          let barX = chartX + index * (chartWidth / valores.length) + 10;
          let barY = chartY + (chartHeight - barHeight);

          // Desenha a barra
          doc.setFillColor(0, 0, 255); // Cor da barra (azul)
          doc.rect(barX, barY, 15, barHeight, "F");

          // Adiciona o rótulo da barra
          doc.text(labels[index], barX + 7.5, chartY + chartHeight + 5, {
            align: "center",
          });
          doc.text(valor.toString(), barX + 7.5, barY - 2, { align: "center" });
        });

        // Adiciona um rodapé
        doc.setLineWidth(0.2);
        doc.line(14, 280, 196, 280); // Linha acima do rodapé
        doc.setFontSize(10);
        doc.text("Relatório gerado automaticamente", 14, 285);
        doc.text("Página 1", 196, 285, { align: "right" });

        // Salva o PDF
        doc.save(`relatorio_acude_${item.id}.pdf`);
      });
    },
    prepararDadosGrafico(item) {
      return [
        { label: "Volume Morto", value: item.volumeMorto },
        { label: "Volume Acumulado", value: item.volumeAcumulado },
        { label: "Volume Máximo", value: item.volumeMaximo },
        { label: "Drenagem", value: item.drenagem },
        { label: "Coeficiente de Tanque", value: item.coeficienteTanque },
      ];
    },
  },
  mounted() {
    this.buscarAcudes();
  },
};
</script>
<style src="../assets/styles.css"></style>
