import { z } from "zod";

/**
 * SCHEMA DE AUTENTICAÇÃO (Auth Schema)
 * 
 * Define as regras de validação para o formulário/payload de login.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "E-mail e senha são obrigatórios." })
    .email("E-mail ou senha inválidos."),

  senha: z
    .string({ required_error: "E-mail e senha são obrigatórios." })
    .min(1, "E-mail e senha são obrigatórios."),
});
