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

        <!-- Modal para Dados de Chuva -->
        <v-dialog v-model="dialogoChuva" max-width="800px" class="custom-dialog">
          <v-card class="custom-card">
            <v-card-title class="headline custom-card-title">Dados de Chuva</v-card-title>
            <v-card-text>
              <v-form ref="formularioChuva">
                <v-row>
                  <v-col cols="6">
                    <label for="municipio">Município</label>
                    <input type="text" id="municipio" v-model="dadosChuva.municipio" class="custom-input" required />
                  </v-col>
                  <v-col cols="6">
                    <label for="estacao">Estação Pluviométrica</label>
                    <input type="text" id="estacao" v-model="dadosChuva.estacao" class="custom-input" required />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <label for="dataInicial">Data Inicial</label>
                    <v-date-picker v-model="dadosChuva.dataInicial" locale="pt-BR" no-title scrollable></v-date-picker>
                  </v-col>
                  <v-col cols="6">
                    <label for="dataFinal">Data Final</label>
                    <v-date-picker v-model="dadosChuva.dataFinal" locale="pt-BR" no-title scrollable></v-date-picker>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="custom-card-actions">
              <v-spacer></v-spacer>
              <v-btn class="btn-rounded btn-outline" @click="fecharModalChuva">Cancelar</v-btn>
              <v-btn class="btn-rounded btn-primary" @click="importarDadosChuva">Importar</v-btn>
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
                  <td class="text-right">{{ formatarNumero(item.volumeMorto) }}</td>
                  <td class="text-right">{{ formatarNumero(item.volumeAcumulado) }}</td>
                  <td class="text-right">{{ formatarNumero(item.volumeMaximo) }}</td>
                  <td class="text-right">{{ formatarNumero(item.drenagem) }}</td>
                  <td class="text-right">{{ formatarNumero(item.coeficienteTanque) }}</td>
                  <td class="text-center">
                    <v-icon small @click="handleClick('chuva', item)" color="blue">mdi-weather-rainy</v-icon>
                    <v-icon small @click="handleClick('vazao', item)" color="blue">mdi-waves</v-icon>
                    <v-icon small @click="handleClick('evaporacao', item)" color="blue">mdi-thermometer</v-icon>
                    <div class="icon-cav" @click="handleClick('cotaAreaVolume', item)">CAV</div>
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
                        Não foram encontrados registros correspondentes à pesquisa.
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


export default {
  name: "AcudeSearch",
  components: {
    BarChart, // Declara o componente de gráfico
  },
  data() {
    return {
      dialogo: false,
      dialogoChuva: false,
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
        volumeMorto: 0,
        volumeAcumulado: 0,
        volumeMaximo: 0,
        drenagem: 0,
        coeficienteTanque: 0,
      },
      dadosChuva: {
        municipio: '',
        estacao: '',
        dataInicial: null,
        dataFinal: null,
      },
      menuDataInicial: false, // controle do menu de Data Inicial
      menuDataFinal: false, // controle do menu de Data Final
      acudes: [],
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
                  .includes(this.filtros.nome.toLowerCase()))
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
      this.formularioValido = this.novoAcude.nome &&
        this.novoAcude.volumeMorto !== null &&
        this.novoAcude.volumeAcumulado !== null &&
        this.novoAcude.volumeMaximo !== null &&
        this.novoAcude.drenagem !== null &&
        this.novoAcude.coeficienteTanque !== null;
    },
    handleClick(acao, item) {
      console.log(`Ação: ${acao}, Item ID: ${item.id}`);
      if (acao === 'chuva') {
        this.dialogoChuva = true;
      }
    },
    fecharModalChuva() {
      this.dialogoChuva = false;
      this.dadosChuva = {
        municipio: '',
        estacao: '',
        dataInicial: null,
        dataFinal: null,
      };
    },
    importarDadosChuva() {
      console.log("Importando dados de chuva:", this.dadosChuva);
      this.fecharModalChuva();
    },
    async gerarRelatorio(item) {
      this.$nextTick(async () => {
        const doc = new jsPDF("p", "mm", "a4");

        // Adiciona um cabeçalho com logo e data
        const logoUrl = 'src/assets/aesa.png'; // URL da sua logo
        doc.addImage(logoUrl, "PNG", 15, 15, 15, 15); // Adiciona a logo
        doc.setFontSize(10);
        doc.text(`Data do Relatório: ${new Date().toLocaleDateString()}`, 160, 15, { align: "right" });

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
          { label: "Coeficiente de Tanque:", value: item.coeficienteTanque.toString() }, // Convertendo para string
        ];

        campos.forEach(campo => {
          doc.setFont("helvetica", "bold");
          doc.text(campo.label, margemEsquerda, posY);
          doc.setFont("helvetica", "normal");
          doc.text(campo.value.toString(), margemEsquerda + 50, posY); // Garantindo que seja string
          posY += espacamentoLinhas;
        });

        // Adiciona o título do gráfico
        posY += 15;
        doc.setFont("helvetica", "bold");
        doc.text("Gráfico de Medições do Açude", 105, posY, { align: "center" });

        // Adiciona o gráfico manualmente
        let chartX = 20;
        let chartY = posY + 10;
        let chartWidth = 150;
        let chartHeight = 60;

        const valores = [item.volumeMorto, item.volumeAcumulado, item.volumeMaximo, item.drenagem, item.coeficienteTanque];
        const labels = ['Vol. Morto', 'Vol. Acum.', 'Vol. Máx.', 'Drenagem', 'Coef. Tanque'];

        // Desenha as linhas de grade
        let maxValue = Math.max(...valores);
        const numLines = 5;
        for (let i = 0; i <= numLines; i++) {
          let lineY = chartY + (i * chartHeight / numLines);
          let valueLabel = Math.round(maxValue - (i * maxValue / numLines));
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
          let barX = chartX + (index * (chartWidth / valores.length)) + 10;
          let barY = chartY + (chartHeight - barHeight);

          // Desenha a barra
          doc.setFillColor(0, 0, 255); // Cor da barra (azul)
          doc.rect(barX, barY, 15, barHeight, 'F');

          // Adiciona o rótulo da barra
          doc.text(labels[index], barX + 7.5, chartY + chartHeight + 5, { align: "center" });
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
        { label: 'Volume Morto', value: item.volumeMorto },
        { label: 'Volume Acumulado', value: item.volumeAcumulado },
        { label: 'Volume Máximo', value: item.volumeMaximo },
        { label: 'Drenagem', value: item.drenagem },
        { label: 'Coeficiente de Tanque', value: item.coeficienteTanque },
      ];
    },
  },
  mounted() {
    this.buscarAcudes();
  },
};
</script>
<style src="../assets/styles.css"></style>
