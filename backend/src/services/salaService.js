import prisma from "../config/prisma.js";
import { normalizarData } from "../utils/dateUtils.js";

/**
 * Serviço de Salas (salaService)
 *
 * 💡 Explicação para iniciantes:
 * Este serviço contém toda a regra de negócio relacionada às salas de coworking.
 * Ele conversa diretamente com o banco de dados PostgreSQL/SQLite via Prisma ORM.
 */

/**
 * Cria uma nova sala de coworking no banco de dados.
 *
 * @param {Object} data - Objeto com os dados da sala
 * @param {string} data.nome - Nome da sala (ex: "Sala de Reuniões A")
 * @param {number} data.capacidade - Quantidade máxima de pessoas
 * @param {string} [data.descricao] - Descrição opcional da sala
 * @param {number} data.precoLocacao - Preço da locação por turno
 * @returns {Promise<Object>} A sala cadastrada no banco de dados
 */
export async function createSala(data) {
  const { nome, capacidade, descricao, precoLocacao } = data;

  return await prisma.sala.create({
    data: {
      nome,
      capacidade,
      descricao: descricao || null,
      precoLocacao,
    },
  });
}

/**
 * Busca salas no banco de dados com suporte a filtro opcional por disponibilidade.
 *
 * 💡 Explicação do filtro Prisma `none`:
 * Quando `disponivel=true` é enviado na query string, o Prisma faz uma consulta condicional:
 * `where.reservas = { none: { dia, turno } }`.
 * Isso significa: "Retorne apenas as salas que NÃO possuem NENHUMA reserva vinculada para esta data e turno".
 *
 * @param {Object} [filters={}] - Objeto contendo os parâmetros de filtro da query string
 * @param {string|boolean} [filters.disponivel] - Flag "true" para filtrar apenas salas disponíveis
 * @param {string} [filters.dia] - Data no formato "YYYY-MM-DD"
 * @param {string} [filters.turno] - Turno no formato "MANHA", "TARDE" ou "NOITE"
 * @returns {Promise<Array>} Lista de salas encontradas
 * @throws {Error} Lança erro 400 Bad Request se os parâmetros obrigatórios de disponibilidade faltarem ou forem inválidos
 */
export async function getAllSalas(filters = {}) {
  const { disponivel, dia, turno } = filters;
  const where = {};

  // Se o filtro de disponibilidade estiver ativo
  if (disponivel === "true" || disponivel === true) {
    if (!dia || !turno) {
      const error = new Error(
        "Para filtrar por disponibilidade, os parâmetros 'dia' e 'turno' são obrigatórios.",
      );
      error.status = 400;
      throw error;
    }

    const dataReserva = normalizarData(dia);
    if (!dataReserva || isNaN(dataReserva.getTime())) {
      const error = new Error(
        "A data informada no parâmetro 'dia' é inválida.",
      );
      error.status = 400;
      throw error;
    }

    // Filtra apenas salas que NÃO possuem reservas para o dia e turno informados
    where.reservas = {
      none: {
        dia: dataReserva,
        turno: String(turno).trim().toUpperCase(),
      },
    };
  }

  return await prisma.sala.findMany({ where });
}

/**
 * Busca uma sala única pelo seu ID numérico.
 *
 * @param {number} id - Identificador único da sala
 * @returns {Promise<Object>} Objeto com os dados da sala
 * @throws {Error} Lança erro 404 Not Found se a sala não for encontrada
 */
export async function getSalaById(id) {
  const sala = await prisma.sala.findUnique({
    where: { id },
  });

  if (!sala) {
    const error = new Error("Sala não encontrada.");
    error.status = 404;
    throw error;
  }

  return sala;
}

/**
 * Atualiza as informações de uma sala existente pelo ID.
 *
 * @param {number} id - Identificador único da sala a ser atualizada
 * @param {Object} data - Objeto com os campos a serem modificados
 * @returns {Promise<Object>} Objeto da sala após a atualização
 * @throws {Error} Lança erro 404 Not Found se a sala não existir
 */
export async function updateSala(id, data) {
  // 1. Verificar se a sala existe antes de tentar atualizar
  const salaExistente = await prisma.sala.findUnique({
    where: { id },
  });

  if (!salaExistente) {
    const error = new Error("Sala não encontrada.");
    error.status = 404;
    throw error;
  }

  // 2. Atualizar no banco de dados com os novos dados
  return await prisma.sala.update({
    where: { id },
    data,
  });
}

/**
 * Exclui uma sala permanentemente do banco de dados.
 *
 * @param {number} id - Identificador único da sala a ser excluída
 * @returns {Promise<{success: boolean, message: string}>} Objeto de confirmação
 * @throws {Error} Lança erro 404 Not Found se a sala não existir
 */
export async function deleteSala(id) {
  const salaExistente = await prisma.sala.findUnique({
    where: { id },
  });

  if (!salaExistente) {
    const error = new Error("Sala não encontrada.");
    error.status = 404;
    throw error;
  }

  await prisma.sala.delete({
    where: { id },
  });

  return { success: true, message: "Sala deletada com sucesso." };
}
