<template>
    <v-dialog :value="dialogo" @input="updateDialogo" max-width="500px" class="custom-dialog">
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
                <v-date-picker v-model="dadosChuva.dataInicial" required />
              </v-col>
              <v-col cols="6">
                <label for="dataFinal">Data Final</label>
                <v-date-picker v-model="dadosChuva.dataFinal" required />
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
  </template>
  
  <script>
  export default {
    props: {
      dialogo: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        dadosChuva: {
          municipio: '',
          estacao: '',
          dataInicial: null,
          dataFinal: null,
        },
      };
    },
    methods: {
      updateDialogo(value) {
        this.$emit('update:dialogo', value);
      },
      fecharModalChuva() {
        this.updateDialogo(false);
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
    },
  };
  </script>
  