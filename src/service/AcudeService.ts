// src/service/AcudeService.ts
import axios from "axios";
import Cookies from "js-cookie";
import { AcudeData } from "../model/Acude"; // Ajuste o caminho conforme necessário

const API_URL = "http://localhost:8080/api/v1/acude";

const acudeService = {
  async listarTodosAcudes(nome: string) {
    try {
      // Adiciona log para verificar o parâmetro enviado
      console.log("Parâmetro de nome:", nome);

      const response = await axios.get(`${API_URL}/listarAcudes`, {
        params: { nome: nome },
      });

      // Adiciona log para verificar a resposta da API
      console.log("Resposta da API:", response.data);

      return response.data;
    } catch (error) {
      // Adiciona log para verificar o erro
      console.error("Erro ao listar açudes:", error);
      throw new Error(error.response?.data?.message || "Erro ao listar açudes");
    }
  },

  async buscarAcudePorNome(nome: string) {
    try {
      const response = await axios.get(`${API_URL}/buscarAcudePorNome`, {
        params: { nome: nome },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erro ao buscar açude");
    }
  },

  async importarChuvas(municipio, posto, anoInicial, anoFinal, codigo) {
    try {
      // Verifique se todos os parâmetros estão sendo passados corretamente
      const response = await axios.get(
        "http://localhost:8080/api/v1/chuva/importarChuvas",
        {
          params: {
            municipio, // Nome do município
            posto, // Nome do posto pluviométrico
            anoInicial, // Ano inicial
            anoFinal, // Ano final
            codigo, // Código do município ou do posto
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao importar dados de chuva:", error);
      throw new Error("Erro ao importar dados de chuva");
    }
  },

  async createAcude(acude: AcudeData) {
    try {
      const response = await axios.post(`${API_URL}/criarAcudes`, acude);
      if (response.status === 201) {
        Cookies.set("token", response.data.token, { expires: 7 }); // O cookie expira em 7 dias
        return response.data; // Retorna os dados completos da resposta
      } else {
        throw new Error("Falha ao criar açude");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erro ao criar açude");
    }
  },
};

export default acudeService;
