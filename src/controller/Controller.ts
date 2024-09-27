import LoginService from "../service/LoginService";
import acudeService from "../service/AcudeService";

const controller = {
  async login(req, res) {
    const { cpf, senha } = req.body;
    try {
      const token = await LoginService.login(cpf, senha);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
  },

  async listarAcudes(req, res) {
    const { nome } = req.query;
    try {
      const acudes = await acudeService.listarTodosAcudes(nome);
      return res.status(200).json(acudes);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao listar açudes", error });
    }
  },

  async criarAcude(req, res) {
    const { nome, localizacao } = req.body;
    try {
      const novoAcude = await acudeService.createAcude({ nome, localizacao });
      return res.status(201).json(novoAcude);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar açude", error });
    }
  },
  async importarDadosChuva() {
    try {
      // Separe o nome do município e do posto
      const [municipioSelecionado, posto] =
        this.dadosChuva.municipio.split(" - ");
      const anoInicial = this.dadosChuva.dataInicial.split("/")[1];
      const anoFinal = this.dadosChuva.dataFinal.split("/")[1];

      // Adicione logs para verificar os valores
      console.log("Municipio:", municipioSelecionado);
      console.log("Estação:", posto);
      console.log("Ano Inicial:", anoInicial);
      console.log("Ano Final:", anoFinal);

      // Envie os dados separadamente
      const response = await acudeService.importarChuvas(
        municipioSelecionado,
        posto,
        anoInicial,
        anoFinal,
        this.dadosChuva.codigo
      );

      this.dadosImportados = response.objeto[0].anosMensais;
      this.dialogoDadosImportados = true;
      this.dialogoChuva = false; // Fecha o modal de importação
    } catch (error) {
      console.error("Erro ao importar dados de chuva:", error);
    }
  },
  async salvarDadosChuva() {
    // Prepare os dados para enviar ao backend
    const dadosParaSalvar = this.dadosChuvaImportados.map(dado => ({
      idAcude: dado.idAcude,
      municipio: dado.municipio,
      estacao: dado.estacao,
      anosMensais: dado.anosMensais.map(ano => ({
        ano: ano.ano,
        chuvaPorMes: ano.dadosMensais.reduce((acc, item) => {
          acc[item.mes] = parseFloat(item.valor.replace(' mm', ''));
          return acc;
        }, {}),
      })),
    }));

    try {
      // Chama o serviço para salvar os dados no backend
      await acudeService.salvarChuvas(dadosParaSalvar);
      this.$toast.success("Dados de chuva salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar os dados de chuva:", error);
      this.$toast.error("Erro ao salvar os dados de chuva.");
    }
  },
  // Endpoint para listar as vazões de um açude por ID
  async listarVazoesPorIdAcude(req, res) {
    const { id_acude } = req.query;
    try {
      const vazoes = await acudeService.listarVazoesPorIdAcude(id_acude);
      return res.status(200).json({
        codigoMensagem: 0,
        mensagem: "Operação realizada com sucesso!",
        objeto: vazoes,
        dataServidor: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({
        codigoMensagem: 1,
        mensagem: "Erro ao listar vazões",
        error: error.message,
      });
    }
  },
  // Controller para realizar a atualização de vazões
async editarVazoes(req, res) {
  try {
    const vazoes = req.body; // Recebe a lista de vazões que serão atualizadas
    console.log("Dados recebidos para atualização:", vazoes);

    // Chama o serviço que faz a atualização das vazões no backend
    await acudeService.editarVazoes(vazoes);

    // Retorna uma resposta de sucesso
    return res.status(200).json({
      codigoMensagem: 0,
      mensagem: "Vazões atualizadas com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao editar vazões:", error);

    // Retorna uma resposta de erro
    return res.status(500).json({
      codigoMensagem: 1,
      mensagem: "Erro ao atualizar vazões",
      error: error.message,
    });
  }
},
// Endpoint para listar evaporações por ID do açude
async listarEvaporacoesPorIdAcude(req, res) {
  const { id_acude } = req.query;
  try {
      const evaporacoes = await acudeService.listarEvaporacoesPorIdAcude(id_acude);
      return res.status(200).json({
          codigoMensagem: 0,
          mensagem: "Operação realizada com sucesso!",
          objeto: evaporacoes,
          dataServidor: new Date().toISOString(),
      });
  } catch (error) {
      return res.status(500).json({
          codigoMensagem: 1,
          mensagem: "Erro ao listar evaporações",
          error: error.message,
      });
  }
},
// Controller para realizar a atualização de evaporações
async editarEvaporacoes(req, res) {
  try {
    const evaporacoes = req.body; // Recebe a lista de evaporações que serão atualizadas
    console.log("Dados recebidos para atualização:", evaporacoes);

    // Chama o serviço que faz a atualização das evaporações no backend
    await acudeService.editarEvaporacoes(evaporacoes);

    return res.status(200).json({
      codigoMensagem: 0,
      mensagem: "Evaporações atualizadas com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao editar evaporações:", error);

    return res.status(500).json({
      codigoMensagem: 1,
      mensagem: "Erro ao atualizar evaporações",
      error: error.message,
    });
  }
}

}

export default controller;
