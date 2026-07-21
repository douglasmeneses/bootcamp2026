import * as reservaService from "../services/reservaService.js";

/**
 * CAMADA DE CONTROLLERS - RESERVAS (reservaController)
 * 
 * Gerencia as requisições HTTP relacionadas às reservas de salas do coworking.
 */

/**
 * CRIA UMA NOVA RESERVA
 * Endpoint: POST /api/reservas
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
 * LISTA TODAS AS RESERVAS
 * Endpoint: GET /api/reservas
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
 * BUSCA UMA RESERVA PELO ID
 * Endpoint: GET /api/reservas/:id
 */
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const reserva = await reservaService.getReservaById(id);
    return res.json(reserva);
  } catch (err) {
    next(err);
  }
}

/**
 * ATUALIZA UMA RESERVA PELO ID
 * Endpoint: PUT /api/reservas/:id
 */
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const reservaAtualizada = await reservaService.updateReserva(id, req.body);
    return res.json(reservaAtualizada);
  } catch (err) {
    next(err);
  }
}

/**
 * EXCLUI UMA RESERVA PELO ID
 * Endpoint: DELETE /api/reservas/:id
 */
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const result = await reservaService.deleteReserva(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
