import prisma from "../config/prisma.js";

/**
 * CAMADA DE SERVIÇOS - SALAS (salaService)
 * 
 * Regras de negócio e comunicação com o banco referentes às Salas de Coworking.
 * A validação e conversão de dados do corpo da requisição é tratada pelo Zod no middleware.
 */

/**
 * CRIA UMA NOVA SALA
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
 * BUSCA SALAS (COM OU SEM FILTRO DE DISPONIBILIDADE)
 */
export async function getAllSalas(filters = {}) {
  const { disponivel, dia, turno } = filters;
  const where = {};

  // Se o filtro de disponibilidade estiver ativo
  if (disponivel === "true" || disponivel === true) {
    if (!dia || !turno) {
      const error = new Error("Para filtrar por disponibilidade, os parâmetros 'dia' e 'turno' são obrigatórios.");
      error.status = 400;
      throw error;
    }

    const dataReserva = new Date(dia);
    if (isNaN(dataReserva.getTime())) {
      const error = new Error("A data informada no parâmetro 'dia' é inválida.");
      error.status = 400;
      throw error;
    }
    dataReserva.setHours(0, 0, 0, 0);

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
 * BUSCA UMA SALA POR ID
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
 * ATUALIZA UMA SALA POR ID
 */
export async function updateSala(id, data) {
  // 1. Verificar se a sala existe
  const salaExistente = await prisma.sala.findUnique({
    where: { id },
  });

  if (!salaExistente) {
    const error = new Error("Sala não encontrada.");
    error.status = 404;
    throw error;
  }

  // 2. Atualizar no banco de dados com os dados já validados pelo Zod
  return await prisma.sala.update({
    where: { id },
    data,
  });
}

/**
 * EXCLUI UMA SALA POR ID
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
