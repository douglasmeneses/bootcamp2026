import { Router } from "express";
import * as reservaController from "../controllers/reservaController.js";
import { validate } from "../middlewares/validate.js";
import { createReservaSchema, updateReservaSchema } from "../schemas/reservaSchema.js";

/**
 * ROTAS DE RESERVAS
 * 
 * Define os endpoints RESTful para gestão de reservas de salas no coworking.
 */
const router = Router();

/**
 * Cadastrar uma nova reserva
 * Rota: POST /api/reservas
 * Corpo esperado (JSON): { idUsuario, idSala, dia, turno }
 */
router.post("/", validate(createReservaSchema), reservaController.create);

/**
 * Listar todas as reservas cadastradas
 * Rota: GET /api/reservas
 */
router.get("/", reservaController.getAll);

/**
 * Buscar detalhes de uma reserva pelo ID
 * Rota: GET /api/reservas/:id
 */
router.get("/:id", reservaController.getById);

/**
 * Atualizar dados de uma reserva pelo ID
 * Rota: PUT /api/reservas/:id
 * Corpo esperado (JSON): campos que deseja alterar (idUsuario, idSala, dia, turno)
 */
router.put("/:id", validate(updateReservaSchema), reservaController.update);

/**
 * Excluir permanentemente uma reserva pelo ID
 * Rota: DELETE /api/reservas/:id
 */
router.delete("/:id", reservaController.remove);

export default router;
