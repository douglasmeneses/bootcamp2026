import { z } from "zod";

/**
 * SCHEMA DE SALAS (Sala Schema)
 * 
 * Define as regras de validação para cadastro e atualização de salas de coworking.
 */
export const createSalaSchema = z.object({
  nome: z
    .string({ required_error: "Campos 'nome', 'capacidade' e 'precoLocacao' são obrigatórios." })
    .min(2, "O nome da sala deve ter pelo menos 2 caracteres."),

  capacidade: z.coerce
    .number({
      required_error: "Campos 'nome', 'capacidade' e 'precoLocacao' são obrigatórios.",
      invalid_type_error: "A capacidade da sala deve ser um número inteiro maior que zero.",
    })
    .int("A capacidade da sala deve ser um número inteiro maior que zero.")
    .positive("A capacidade da sala deve ser um número inteiro maior que zero."),

  descricao: z.string().optional().nullable(),

  precoLocacao: z.coerce
    .number({
      required_error: "Campos 'nome', 'capacidade' e 'precoLocacao' são obrigatórios.",
      invalid_type_error: "O preço de locação deve ser um valor numérico válido maior ou igual a zero.",
    })
    .min(0, "O preço de locação deve ser um valor numérico válido maior ou igual a zero."),
});

export const updateSalaSchema = createSalaSchema.partial();
