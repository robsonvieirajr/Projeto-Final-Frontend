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
};

export default controller;
