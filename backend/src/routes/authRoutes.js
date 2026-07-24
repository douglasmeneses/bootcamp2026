import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../schemas/authSchema.js";

/**
 * ROTAS DE AUTENTICAÇÃO
 * 
 * O que é?
 * Mapeia as rotas HTTP de autenticação (ex: /login) para as funções controladoras correspondentes.
 */
const router = Router();

/**
 * Endpoint de Login do Usuário
 * Rota: POST /api/auth/login
 * Corpo esperado (JSON): { email, senha }
 */
router.post("/login", validate(loginSchema), authController.login);

export default router;
