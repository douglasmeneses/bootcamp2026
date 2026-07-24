import * as reservaService from "../services/reservaService.js";

/**
 * Controller de Reservas (reservaController)
 * 
 * 💡 Explicação para iniciantes:
 * Este controller gerencia as requisições HTTP RESTful para criação, consulta, atualização e cancelamento de reservas.
 * Ele recebe dados do cliente (via req.body ou req.params) e delega as validações de regras de negócio para o `reservaService.js`.
 */

/**
 * Cria uma nova reserva de sala no sistema.
 * 
 * 📍 Endpoint: POST /api/reservas
 * 📥 Corpo (JSON): { "idUsuario": 1, "idSala": 2, "dia": "YYYY-MM-DD", "turno": "MANHA"|"TARDE"|"NOITE" }
 * 
 * @param {import("express").Request} req - Requisição contendo os dados da reserva em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 201 Created com a reserva criada
 * @param {import("express").NextFunction} next - Repassa eventuais erros (ex: 409 conflito) para o middleware central
 */
export async function create(req, res, next) {
  try {
    const novaReserva = await reservaService.createReserva(req.body);
    return res.status(201).json(novaReserva);
  } catch (err) {
    next(err);
  }
}

/**
 * Lista todas as reservas cadastradas no sistema.
 * 
 * 📍 Endpoint: GET /api/reservas
 * 
 * @param {import("express").Request} req - Requisição HTTP
 * @param {import("express").Response} res - Resposta HTTP 200 OK com array de reservas
 * @param {import("express").NextFunction} next - Passa eventuais erros para o tratamento global
 */
export async function getAll(req, res, next) {
  try {
    const reservas = await reservaService.getAllReservas();
    return res.json(reservas);
  } catch (err) {
    next(err);
  }
}

/**
 * Busca os detalhes de uma reserva específica pelo seu ID.
 * 
 * 📍 Endpoint: GET /api/reservas/:id
 * 
 * @param {import("express").Request} req - Requisição contendo o ID em `req.params.id`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com o objeto da reserva
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
    const reserva = await reservaService.getReservaById(id);
    return res.json(reserva);
  } catch (err) {
    next(err);
  }
}

/**
 * Exclui uma reserva pelo ID.
 * 
 * 📍 Endpoint: DELETE /api/reservas/:id
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
    const result = await reservaService.deleteReserva(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
