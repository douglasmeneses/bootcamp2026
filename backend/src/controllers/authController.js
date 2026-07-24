import * as authService from "../services/authService.js";

/**
 * Controller de Autenticação (Auth Controller)
 * 
 * 💡 Explicação para iniciantes:
 * A camada Controller é a "porta de entrada" das requisições HTTP na aplicação.
 * Responsabilidades do Controller:
 * 1. Receber os objetos `req` (Request) e `res` (Response) do Express.
 * 2. Extrair dados da requisição (`req.body`, `req.params`, `req.query`).
 * 3. Chamar a camada de negócios (Service), que executa as regras e consulta o banco.
 * 4. Responder ao cliente com o status HTTP adequado (`res.status(...).json(...)`).
 * 5. Se houver erro, repassar para o middleware central de tratamento de erros (`next(err)`).
 */

/**
 * Processa a tentativa de login de um usuário na aplicação.
 * 
 * 📍 Endpoint: POST /api/auth/login
 * 📥 Corpo esperado (JSON): { "email": "...", "senha": "..." }
 * 
 * @param {import("express").Request} req - Objeto de requisição do Express contendo os dados em `req.body`
 * @param {import("express").Response} res - Objeto de resposta do Express enviado de volta ao cliente
 * @param {import("express").NextFunction} next - Função para repassar erros para o manipulador central do Express
 * @returns {Promise<Response>} Devolve JSON com mensagem de sucesso e dados do usuário (HTTP 200 OK)
 */
export async function login(req, res, next) {
  try {
    const { email, senha } = req.body || {};
    const resultado = await authService.loginUsuario({ email, senha });

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}
