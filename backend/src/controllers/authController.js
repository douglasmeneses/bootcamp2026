import * as authService from "../services/authService.js";

/**
 * CAMADA DE CONTROLLERS DE AUTENTICAÇÃO (Auth Controller)
 * 
 * O que é?
 * É a camada responsável por receber a requisição de login HTTP (req, res), extrair email e senha,
 * acionar o serviço de autenticação e devolver a resposta adequada (200 OK ou erro interceptado pelo Express).
 */

/**
 * REALIZA O LOGIN DO USUÁRIO
 * Endpoint: POST /api/auth/login
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
