import { ZodError } from "zod";

/**
 * MIDDLEWARE DE VALIDAÇÃO REUTILIZÁVEL (Zod)
 * 
 * O que é?
 * É uma função utilitária que recebe um Schema do Zod e retorna um Middleware do Express.
 * 
 * Por que usar?
 * Em vez de repetirmos blocos `if (!campo) throw new Error(...)` em cada controller ou service,
 * usamos este middleware na rota para garantir que os dados cheguem limpos e validados!
 * 
 * Como funciona?
 * 1. Intercepta os dados enviados pelo cliente no corpo da requisição (`req.body`).
 * 2. Valida contra o schema fornecido usando `schema.parse(req.body)`.
 * 3. Se estiver tudo OK: atualiza `req.body` com os dados sanitizados e chama `next()`.
 * 4. Se houver erro: passa o erro para o Express tratar centralizadamente.
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body || {});
      next();
    } catch (error) {
      next(error);
    }
  };
}
