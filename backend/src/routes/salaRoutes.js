import { Router } from "express";
import * as salaController from "../controllers/salaController.js";
import { validate } from "../middlewares/validate.js";
import { createSalaSchema, updateSalaSchema } from "../schemas/salaSchema.js";

/**
 * ROTAS DE SALAS
 * 
 * Define os endpoints RESTful para gestão das salas de coworking.
 */
const router = Router();

/**
 * Cadastrar uma nova sala
 * Rota: POST /api/salas
 * Corpo esperado (JSON): { nome, capacidade, descricao?, precoLocacao }
 */
router.post("/", validate(createSalaSchema), salaController.create);

/**
 * Listar todas as salas cadastradas
 * Rota: GET /api/salas
 */
router.get("/", salaController.getAll);

/**
 * Buscar detalhes de uma sala pelo ID
 * Rota: GET /api/salas/:id
 */
router.get("/:id", salaController.getById);

/**
 * Atualizar dados de uma sala pelo ID
 * Rota: PUT /api/salas/:id
 * Corpo esperado (JSON): campos que deseja alterar (nome, capacidade, descricao, precoLocacao)
 */
router.put("/:id", validate(updateSalaSchema), salaController.update);

/**
 * Excluir permanentemente uma sala pelo ID
 * Rota: DELETE /api/salas/:id
 */
router.delete("/:id", salaController.remove);

export default router;
