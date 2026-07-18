import { Router } from "express";
import * as usuarioController from "../controllers/usuarioController.js";

/**
 * ROTAS DE USUÁRIOS
 * 
 * O que é?
 * Este arquivo define todos os endpoints (caminhos de URL) específicos para a entidade de Usuário.
 * Ele mapeia um Método HTTP + Caminho para a função correspondente na camada de Controller.
 * 
 * Resumo dos Métodos HTTP usados (Padrão REST):
 * - POST: Usado para criar um novo recurso (ex: cadastrar usuário).
 * - GET: Usado para buscar/recuperar informações (ex: listar todos, buscar por ID).
 * - PUT: Usado para atualizar um recurso existente por completo (ou parcialmente no nosso caso).
 * - DELETE: Usado para remover um recurso.
 */
const router = Router();

/**
 * Cadastrar um novo usuário
 * Rota: POST /api/usuarios
 * Corpo esperado (JSON): { nome, email, senha, telefone, cpf }
 */
router.post("/", usuarioController.create);

/**
 * Listar todos os usuários cadastrados
 * Rota: GET /api/usuarios
 */
router.get("/", usuarioController.getAll);

/**
 * Buscar detalhes de um único usuário pelo ID
 * Rota: GET /api/usuarios/:id
 * 
 * O que significa o `:id`?
 * É um parâmetro de rota dinâmico (placeholder). Qualquer valor colocado no lugar do `:id`
 * (ex: /usuarios/5) será capturado e estará disponível no controller em `req.params.id`.
 */
router.get("/:id", usuarioController.getById);

/**
 * Atualizar dados cadastrais de um usuário pelo ID
 * Rota: PUT /api/usuarios/:id
 * Corpo esperado (JSON): campos que deseja alterar (nome, email, senha, telefone, cpf)
 */
router.put("/:id", usuarioController.update);

/**
 * Excluir permanentemente um usuário pelo ID
 * Rota: DELETE /api/usuarios/:id
 */
router.delete("/:id", usuarioController.remove);

export default router;
