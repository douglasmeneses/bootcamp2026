import { ZodError } from "zod";

/**
 * Higher-Order Function que gera um Middleware de Validação utilizando o Zod.
 * 
 * 💡 Explicação para iniciantes:
 * Um "Middleware" no Express é uma função intermediária que roda ANTES de a requisição chegar ao Controller.
 * Esta função é uma "Higher-Order Function" (função que retorna outra função):
 * 1. Ela recebe o `schema` (as regras de validação definidas com a biblioteca Zod).
 * 2. Retorna a função do middleware `(req, res, next)` que o Express executa a cada requisição.
 * 
 * 🛠️ Fluxo de Execução:
 * - `schema.parse(req.body)`: Valida e transforma os dados do corpo da requisição (`req.body`).
 * - Se os dados forem VÁLIDOS: Substitui `req.body` pelos dados higienizados e chama `next()` para continuar para o Controller.
 * - Se os dados forem INVÁLIDOS: Lança um erro que é capturado pelo `catch(error)` e enviado ao `next(error)`, acionando o tratamento de erros global.
 * 
 * @param {import("zod").ZodSchema} schema - O schema do Zod com as regras dos campos esperados
 * @returns {import("express").RequestHandler} Função de middleware pronta para uso no Express
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
