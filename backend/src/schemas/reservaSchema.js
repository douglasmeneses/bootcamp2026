import { z } from "zod";

/**
 * SCHEMA DE RESERVAS (Reserva Schema)
 * 
 * Define as regras de validação para a criação e atualização de reservas.
 */
export const createReservaSchema = z.object({
  idUsuario: z.coerce
    .number({
      required_error: "Campos 'idUsuario', 'idSala', 'dia' e 'turno' são obrigatórios.",
      invalid_type_error: "'idUsuario' e 'idSala' devem ser valores numéricos inteiros.",
    })
    .int("'idUsuario' e 'idSala' devem ser valores numéricos inteiros.")
    .positive("'idUsuario' e 'idSala' devem ser valores numéricos inteiros."),

  idSala: z.coerce
    .number({
      required_error: "Campos 'idUsuario', 'idSala', 'dia' e 'turno' são obrigatórios.",
      invalid_type_error: "'idUsuario' e 'idSala' devem ser valores numéricos inteiros.",
    })
    .int("'idUsuario' e 'idSala' devem ser valores numéricos inteiros.")
    .positive("'idUsuario' e 'idSala' devem ser valores numéricos inteiros."),

  dia: z
    .string({ required_error: "Campos 'idUsuario', 'idSala', 'dia' e 'turno' são obrigatórios." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "A data informada no campo 'dia' é inválida.",
    }),

  turno: z.enum(["MANHA", "TARDE", "NOITE"], {
    errorMap: () => ({ message: "O turno deve ser MANHA, TARDE ou NOITE." }),
  }),
});

export const updateReservaSchema = createReservaSchema.partial();
