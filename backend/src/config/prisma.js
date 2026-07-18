import { PrismaClient } from '@prisma/client';

/**
 * CLIENTE DO PRISMA (Prisma Client Configuration)
 * 
 * O que é o Prisma?
 * O Prisma é um ORM (Object-Relational Mapper) para Node.js e TypeScript. Ele permite que a gente
 * interaja com o banco de dados (SQLite, Postgres, MySQL, etc.) usando código JavaScript/TypeScript 
 * orientado a objetos, em vez de escrever consultas SQL brutas na mão.
 * 
 * O que faz esta instância?
 * - O PrismaClient gerencia a conexão com o banco de dados e cria um pool de conexões automaticamente.
 * - Devemos ter apenas UMA instância do PrismaClient ativa no ciclo de vida da aplicação para evitar 
 *   estouro do limite de conexões simultâneas do banco de dados (especialmente em ambientes serverless
 *   ou com muitas instâncias de servidor).
 * - A propriedade `log` configura o nível de logs de acordo com o ambiente (development vs production).
 *   No ambiente de desenvolvimento, ele imprime no console todas as queries SQL geradas pelo Prisma,
 *   o que ajuda muito a debugar e otimizar as consultas.
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default prisma;
