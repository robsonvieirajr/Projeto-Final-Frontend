export interface ChuvaData {
    municipio: string;
    estacao: string;
    ano: number; 
    chuvaPorMes: {
      Jan: number;
      Fev: number;
      Mar: number;
      Abr: number;
      Mai: number;
      Jun: number;
      Jul: number;
      Ago: number;
      Set: number;
      Out: number;
      Nov: number;
      Dez: number;
    };
  }
  