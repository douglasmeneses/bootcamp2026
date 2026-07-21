import prisma from "../config/prisma.js";

/**
 * CAMADA DE SERVIÇOS - RESERVAS (reservaService)
 * 
 * Regras de negócio para gerenciar reservas de salas de coworking.
 * As validações do formato dos dados são tratadas pelo Zod no middleware.
 */

// Campos selecionados do usuário ao incluir detalhes nas reservas
const usuarioSelect = {
  select: {
    id: true,
    nome: true,
    email: true,
    telefone: true,
  },
};

/**
 * CRIA UMA NOVA RESERVA
 */
export async function createReserva(data) {
  const { idUsuario, idSala, dia, turno } = data;

  // 1. Verificar se o Usuário existe
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { id: idUsuario },
  });
  if (!usuarioExistente) {
    const error = new Error("Usuário informado não foi encontrado.");
    error.status = 404;
    throw error;
  }

  // 2. Verificar se a Sala existe
  const salaExistente = await prisma.sala.findUnique({
    where: { id: idSala },
  });
  if (!salaExistente) {
    const error = new Error("Sala informada não foi encontrada.");
    error.status = 404;
    throw error;
  }

  // 3. Normalizar data do agendamento (00:00:00.000)
  const dataReserva = new Date(dia);
  dataReserva.setHours(0, 0, 0, 0);

  // 4. Verificar conflito de agendamento (mesma sala, dia e turno)
  const reservaConflito = await prisma.reserva.findFirst({
    where: {
      idSala,
      dia: dataReserva,
      turno,
    },
  });

  if (reservaConflito) {
    const error = new Error("Esta sala já possui uma reserva confirmada para o dia e turno informados.");
    error.status = 409;
    throw error;
  }

  // 5. Criar reserva no banco de dados
  return await prisma.reserva.create({
    data: {
      idUsuario,
      idSala,
      dia: dataReserva,
      turno,
    },
    include: {
      usuario: usuarioSelect,
      sala: true,
    },
  });
}

/**
 * BUSCA TODAS AS RESERVAS
 */
export async function getAllReservas() {
  return await prisma.reserva.findMany({
    include: {
      usuario: usuarioSelect,
      sala: true,
    },
  });
}

/**
 * BUSCA RESERVA POR ID
 */
export async function getReservaById(id) {
  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: {
      usuario: usuarioSelect,
      sala: true,
    },
  });

  if (!reserva) {
    const error = new Error("Reserva não encontrada.");
    error.status = 404;
    throw error;
  }

  return reserva;
}

/**
 * ATUALIZA UMA RESERVA POR ID
 */
export async function updateReserva(id, data) {
  const { idUsuario, idSala, dia, turno } = data;

  // 1. Verificar se a reserva existe
  const reservaExistente = await prisma.reserva.findUnique({
    where: { id },
  });

  if (!reservaExistente) {
    const error = new Error("Reserva não encontrada.");
    error.status = 404;
    throw error;
  }

  const updateData = {};

  // 2. Se alterar usuário, verificar existência no banco
  if (idUsuario !== undefined) {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: idUsuario },
    });
    if (!usuarioExistente) {
      const error = new Error("Usuário informado não foi encontrado.");
      error.status = 404;
      throw error;
    }
    updateData.idUsuario = idUsuario;
  }

  // 3. Se alterar sala, verificar existência no banco
  if (idSala !== undefined) {
    const salaExistente = await prisma.sala.findUnique({
      where: { id: idSala },
    });
    if (!salaExistente) {
      const error = new Error("Sala informada não foi encontrada.");
      error.status = 404;
      throw error;
    }
    updateData.idSala = idSala;
  }

  // 4. Se alterar a data
  if (dia !== undefined) {
    const dataReserva = new Date(dia);
    dataReserva.setHours(0, 0, 0, 0);
    updateData.dia = dataReserva;
  }

  // 5. Se alterar o turno
  if (turno !== undefined) {
    updateData.turno = turno;
  }

  // 6. Verificar conflito de agendamento (ignora a própria reserva sendo editada)
  const targetSalaId = updateData.idSala ?? reservaExistente.idSala;
  const targetDia = updateData.dia ?? reservaExistente.dia;
  const targetTurno = updateData.turno ?? reservaExistente.turno;

  const conflito = await prisma.reserva.findFirst({
    where: {
      idSala: targetSalaId,
      dia: targetDia,
      turno: targetTurno,
      id: { not: id },
    },
  });

  if (conflito) {
    const error = new Error("Esta sala já possui outra reserva confirmada para o dia e turno informados.");
    error.status = 409;
    throw error;
  }

  // 7. Atualizar reserva no banco
  return await prisma.reserva.update({
    where: { id },
    data: updateData,
    include: {
      usuario: usuarioSelect,
      sala: true,
    },
  });
}

/**
 * EXCLUI UMA RESERVA POR ID
 */
export async function deleteReserva(id) {
  const reservaExistente = await prisma.reserva.findUnique({
    where: { id },
  });

  if (!reservaExistente) {
    const error = new Error("Reserva não encontrada.");
    error.status = 404;
    throw error;
  }

  await prisma.reserva.delete({
    where: { id },
  });

  return { success: true, message: "Reserva deletada com sucesso." };
}
