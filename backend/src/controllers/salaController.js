import * as salaService from "../services/salaService.js";

/**
 * CAMADA DE CONTROLLERS - SALAS (salaController)
 * 
 * Gerencia as requisições HTTP relacionadas às salas do coworking.
 */

/**
 * CRIA UMA NOVA SALA
 * Endpoint: POST /api/salas
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
 * LISTA AS SALAS (com suporte a filtro por disponibilidade)
 * Endpoint: GET /api/salas
 * Query params opcionais: disponivel=true, dia=YYYY-MM-DD, turno=MANHA|TARDE|NOITE
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
 * BUSCA UMA SALA PELO ID
 * Endpoint: GET /api/salas/:id
 */
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const sala = await salaService.getSalaById(id);
    return res.json(sala);
  } catch (err) {
    next(err);
  }
}

/**
 * ATUALIZA UMA SALA PELO ID
 * Endpoint: PUT /api/salas/:id
 */
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const salaAtualizada = await salaService.updateSala(id, req.body);
    return res.json(salaAtualizada);
  } catch (err) {
    next(err);
  }
}

/**
 * EXCLUI UMA SALA PELO ID
 * Endpoint: DELETE /api/salas/:id
 */
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const result = await salaService.deleteSala(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
