import * as salaService from "../services/salaService.js";

/**
 * Controller de Salas (salaController)
 * 
 * 💡 Explicação para iniciantes:
 * Este controller gerencia todas as requisições HTTP RESTful relacionadas às salas de coworking.
 * Cada função corresponde a um verbo HTTP (POST, GET, PUT, DELETE) e repassa a lógica pesada para `salaService.js`.
 */

/**
 * Cria uma nova sala no sistema.
 * 
 * 📍 Endpoint: POST /api/salas
 * 📥 Corpo (JSON): { "nome": "...", "capacidade": 10, "descricao": "...", "precoLocacao": 50 }
 * 
 * @param {import("express").Request} req - Objeto contendo os dados da sala em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 201 Created com o objeto criado
 * @param {import("express").NextFunction} next - Passa eventuais erros para o tratamento global
 */
export async function create(req, res, next) {
  try {
    const novaSala = await salaService.createSala(req.body);
    return res.status(201).json(novaSala);
  } catch (err) {
    next(err);
  }
}

/**
 * Lista todas as salas cadastradas (com suporte a filtros por disponibilidade na query string).
 * 
 * 📍 Endpoint: GET /api/salas
 * 🔎 Query Params Opcionais: ?disponivel=true&dia=YYYY-MM-DD&turno=MANHA|TARDE|NOITE
 * 
 * @param {import("express").Request} req - Requisição contendo query params em `req.query`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com array de salas
 * @param {import("express").NextFunction} next - Passa eventuais erros para o tratamento global
 */
export async function getAll(req, res, next) {
  try {
    const salas = await salaService.getAllSalas(req.query);
    return res.json(salas);
  } catch (err) {
    next(err);
  }
}

/**
 * Busca os detalhes de uma sala específica pelo seu ID.
 * 
 * 📍 Endpoint: GET /api/salas/:id
 * 
 * @param {import("express").Request} req - Requisição contendo o ID em `req.params.id`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com o objeto da sala
 * @param {import("express").NextFunction} next - Passa erro 404 para o tratamento global se não encontrada
 */
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const sala = await salaService.getSalaById(id);
    return res.json(sala);
  } catch (err) {
    next(err);
  }
}

/**
 * Atualiza as informações de uma sala pelo ID.
 * 
 * 📍 Endpoint: PUT /api/salas/:id
 * 📥 Corpo (JSON): Campos a serem atualizados
 * 
 * @param {import("express").Request} req - Requisição contendo `req.params.id` e novos dados em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com a sala atualizada
 * @param {import("express").NextFunction} next - Passa eventuais erros para o tratamento global
 */
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const salaAtualizada = await salaService.updateSala(id, req.body);
    return res.json(salaAtualizada);
  } catch (err) {
    next(err);
  }
}

/**
 * Remove uma sala permanentemente do banco de dados pelo ID.
 * 
 * 📍 Endpoint: DELETE /api/salas/:id
 * 
 * @param {import("express").Request} req - Requisição contendo o ID em `req.params.id`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com mensagem de confirmação
 * @param {import("express").NextFunction} next - Passa eventuais erros para o tratamento global
 */
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const result = await salaService.deleteSala(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
