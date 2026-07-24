import prisma from "../config/prisma.js";
import { normalizarData, formatarReserva } from "../utils/dateUtils.js";

/**
 * Serviço de Reservas (reservaService)
 * 
 * 💡 Explicação para iniciantes:
 * Este serviço gerencia as regras de negócio mais complexas do sistema:
 * - Valida a existência prévia do usuário e da sala no banco de dados.
 * - Garante a regra de conflito: **Não permite que duas reservas ocupem a mesma sala no mesmo dia e turno**.
 * - Garante que dados relacionais (usuário e sala) sejam incluídos na resposta formatada.
 */

// Filtro de campos do Usuário para ocultar a senha e retornar apenas dados públicos
const usuarioSelect = {
  select: {
    id: true,
    nome: true,
    email: true,
    telefone: true,
  },
};

/**
 * Cria uma nova reserva após verificar a existência do usuário, da sala e a ausência de conflitos de horário.
 * 
 * 🛠️ Passo a Passo da Regra de Negócio:
 * 1. Verifica se `idUsuario` existe (404 se não existir).
 * 2. Verifica se `idSala` existe (404 se não existir).
 * 3. Normaliza a data para meia-noite no fuso horário local.
 * 4. Consulta se a sala já tem reserva no mesmo dia e turno (409 Conflict se houver).
 * 5. Cria no banco usando `prisma.reserva.create` incluindo os dados do usuário e da sala.
 * 
 * @param {Object} data - Dados da reserva
 * @param {number} data.idUsuario - ID do usuário que está reservando
 * @param {number} data.idSala - ID da sala desejada
 * @param {string} data.dia - Data da reserva ("YYYY-MM-DD")
 * @param {string} data.turno - Turno escolhido ("MANHA" | "TARDE" | "NOITE")
 * @returns {Promise<Object>} A reserva criada com dados formatados
 * @throws {Error} Erro 404 (Usuário/Sala não encontrado) ou 409 (Conflito de reserva)
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

  // 3. Normalizar data para meia-noite local
  const dataReserva = normalizarData(dia);

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
  const novaReserva = await prisma.reserva.create({
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

  return formatarReserva(novaReserva);
}

/**
 * Busca todas as reservas registradas no sistema, incluindo os dados completos da sala e do usuário.
 * 
 * @returns {Promise<Array>} Lista de reservas com datas formatadas
 */
export async function getAllReservas() {
  const reservas = await prisma.reserva.findMany({
    include: {
      usuario: usuarioSelect,
      sala: true,
    },
  });

  return reservas.map(formatarReserva);
}

/**
 * Busca uma reserva específica pelo seu ID.
 * 
 * @param {number} id - Identificador único da reserva
 * @returns {Promise<Object>} Objeto da reserva com relacionamentos
 * @throws {Error} Erro 404 Not Found se não for encontrada
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

  return formatarReserva(reserva);
}

/**
 * Cancela/Exclui uma reserva permanentemente pelo ID.
 * 
 * @param {number} id - Identificador único da reserva
 * @returns {Promise<{success: boolean, message: string}>} Mensagem de confirmação
 * @throws {Error} Erro 404 Not Found se a reserva não existir
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
