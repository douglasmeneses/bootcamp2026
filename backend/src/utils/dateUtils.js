/**
 * Normaliza uma data no formato "YYYY-MM-DD" para o início do dia (00:00:00) no fuso horário local.
 * 
 * 💡 Explicação para iniciantes:
 * Quando você passa "2026-07-25" para `new Date()`, o JavaScript assume por padrão a meia-noite em UTC (00:00 GMT).
 * No fuso horário do Brasil (UTC-3), isso equivale a 21:00 do dia anterior (24/07)!
 * Concatenar 'T00:00:00' força o JavaScript a criar o objeto Date na meia-noite do fuso horário LOCAL da máquina.
 * 
 * @param {string} dia - Data enviada pelo cliente no formato "YYYY-MM-DD"
 * @returns {Date} Objeto Date configurado para a meia-noite no fuso local
 */
export function normalizarData(dia) {
  return new Date(`${dia}T00:00:00`);
}

/**
 * Formata o objeto de reserva garantindo que a propriedade `dia` seja retornada 
 * apenas como uma string simples no formato "YYYY-MM-DD".
 * 
 * 💡 Explicação para iniciantes:
 * O banco de dados (Prisma) retorna o campo `dia` como um objeto `Date` completo do JS (ex: 2026-07-25T00:00:00.000Z).
 * Usamos `.toISOString().split("T")[0]` para extrair apenas a parte da data ("2026-07-25") antes da letra "T".
 * O operador Spread `{ ...reserva }` cria uma cópia do objeto original sobrescrevendo apenas a propriedade `dia`.
 * 
 * @param {Object} reserva - Objeto de reserva retornado do banco
 * @returns {Object} Objeto de reserva com o campo `dia` formatado
 */
export function formatarReserva(reserva) {
  const diaStr = reserva.dia.toISOString().split("T")[0];
  return { ...reserva, dia: diaStr };
}
