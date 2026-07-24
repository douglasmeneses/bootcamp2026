import * as usuarioService from "../services/usuarioService.js";

/**
 * Controller de Usuários (usuarioController)
 * 
 * 💡 Explicação para iniciantes:
 * É a camada responsável por receber as requisições HTTP do cliente, extrair os dados necessários,
 * acionar as regras de negócio corretas (que ficam na camada de Service) e devolver a resposta
 * apropriada (como o status code HTTP correspondente e o corpo em formato JSON).
 * 
 * Papel dos parâmetros da função (req, res, next):
 * - `req` (Request / Requisição): Contém as informações enviadas pelo cliente (`req.body`, `req.params`, `req.query`).
 * - `res` (Response / Resposta): Objeto usado para enviar a resposta de volta ao cliente (ex: `res.json()`, `res.status()`).
 * - `next`: Função usada para passar o fluxo para o próximo middleware do Express. Usamos isso no bloco `catch` para que qualquer erro seja capturado pelo middleware global em `server.js`.
 */

/**
 * Cria um novo usuário no sistema.
 * 
 * 📍 Endpoint: POST /api/usuarios
 * 📥 Corpo (JSON): { "nome": "...", "email": "...", "senha": "...", "telefone": "...", "cpf": "..." }
 * 
 * @param {import("express").Request} req - Objeto de requisição do Express contendo os dados do usuário em `req.body`
 * @param {import("express").Response} res - Resposta HTTP 201 Created com o usuário cadastrado
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 201 Created com os dados do usuário
 */
export async function create(req, res, next) {
  try {
    const novoUsuario = await usuarioService.createUsuario(req.body);
    return res.status(201).json(novoUsuario);
  } catch (err) {
    next(err);
  }
}

/**
 * Lista todos os usuários cadastrados.
 * 
 * 📍 Endpoint: GET /api/usuarios
 * 
 * @param {import("express").Request} req - Objeto de requisição do Express
 * @param {import("express").Response} res - Resposta HTTP 200 OK com array de usuários
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 200 OK com a lista de usuários
 */
export async function getAll(req, res, next) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    return res.json(usuarios);
  } catch (err) {
    next(err);
  }
}

/**
 * Busca um usuário pelo seu ID.
 * 
 * 📍 Endpoint: GET /api/usuarios/:id
 * 
 * @param {import("express").Request} req - Objeto contendo o parâmetro da rota em `req.params.id`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com os dados do usuário
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 200 OK com o usuário encontrado
 */
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const usuario = await usuarioService.getUsuarioById(id);
    return res.json(usuario);
  } catch (err) {
    next(err);
  }
}

/**
 * Atualiza os dados de um usuário pelo seu ID.
 * 
 * 📍 Endpoint: PUT /api/usuarios/:id
 * 📥 Corpo (JSON): Campos que se deseja atualizar
 * 
 * @param {import("express").Request} req - Objeto contendo `req.params.id` e `req.body` com os novos dados
 * @param {import("express").Response} res - Resposta HTTP 200 OK com o usuário atualizado
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 200 OK com os dados atualizados
 */
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const usuarioAtualizado = await usuarioService.updateUsuario(id, req.body);
    return res.json(usuarioAtualizado);
  } catch (err) {
    next(err);
  }
}

/**
 * Exclui um usuário do sistema pelo seu ID.
 * 
 * 📍 Endpoint: DELETE /api/usuarios/:id
 * 
 * @param {import("express").Request} req - Objeto contendo `req.params.id`
 * @param {import("express").Response} res - Resposta HTTP 200 OK com a confirmação da remoção
 * @param {import("express").NextFunction} next - Passa o erro para o manipulador central do Express
 * @returns {Promise<Response>} Retorna a resposta HTTP 200 OK com mensagem de confirmação
 */
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("O parâmetro ID deve ser um número inteiro válido.");
      error.status = 400;
      throw error;
    }
    const result = await usuarioService.deleteUsuario(id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
