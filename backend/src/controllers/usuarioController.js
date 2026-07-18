import * as usuarioService from "../services/usuarioService.js";

/**
 * CAMADA DE CONTROLLERS (Controladores)
 * 
 * O que é?
 * É a camada responsável por receber as requisições HTTP do cliente, extrair os dados necessários,
 * acionar as regras de negócio corretas (que ficam na camada de Service) e devolver a resposta
 * apropriada (como o status code HTTP correspondente e o corpo em formato JSON).
 * 
 * Papel dos parâmetros da função (req, res, next):
 * - `req` (Request / Requisição): Contém as informações enviadas pelo cliente (corpo da requisição, parâmetros da URL, query strings, cabeçalhos, etc.).
 * - `res` (Response / Resposta): Objeto usado para enviar a resposta de volta ao cliente (ex: res.json(), res.status()).
 * - `next`: Função usada para passar o fluxo para o próximo middleware do Express. Usamos isso principalmente no bloco `catch` para que qualquer erro seja capturado pelo middleware global de tratamento de erros definido no `server.js`.
 */

/**
 * CRIA UM NOVO USUÁRIO
 * Endpoint: POST /api/usuarios
 */
export async function create(req, res, next) {
  try {
    // req.body contém os dados enviados pelo cliente no formato JSON (ex: nome, email, senha, etc.)
    const novoUsuario = await usuarioService.createUsuario(req.body);
    
    // Retorna status 201 (Created), que é a boa prática padrão para recursos recém-criados
    return res.status(201).json(novoUsuario);
  } catch (err) {
    // Encaminha o erro para o middleware global de tratamento de erros no server.js
    next(err);
  }
}

/**
 * LISTA TODOS OS USUÁRIOS
 * Endpoint: GET /api/usuarios
 */
export async function getAll(req, res, next) {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    
    // Retorna a lista de usuários com status 200 (OK) por padrão
    return res.json(usuarios);
  } catch (err) {
    next(err);
  }
}

/**
 * BUSCA UM USUÁRIO PELO ID
 * Endpoint: GET /api/usuarios/:id
 */
export async function getById(req, res, next) {
  try {
    // Os parâmetros de rota vêm como String no req.params.
    // É essencial fazer o parsing (conversão) para Integer com parseInt, pois no banco de dados o ID é numérico.
    const id = parseInt(req.params.id);
    
    const usuario = await usuarioService.getUsuarioById(id);
    
    return res.json(usuario);
  } catch (err) {
    next(err);
  }
}

/**
 * ATUALIZA OS DADOS DE UM USUÁRIO PELO ID
 * Endpoint: PUT /api/usuarios/:id
 */
export async function update(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    
    // Enviamos o ID do usuário e os novos dados contidos no req.body para o Service
    const usuarioAtualizado = await usuarioService.updateUsuario(id, req.body);
    
    return res.json(usuarioAtualizado);
  } catch (err) {
    next(err);
  }
}

/**
 * EXCLUI UM USUÁRIO PELO ID
 * Endpoint: DELETE /api/usuarios/:id
 */
export async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    
    const result = await usuarioService.deleteUsuario(id);
    
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
