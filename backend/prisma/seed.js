import { PrismaClient } from '@prisma/client';

// Instanciamos o cliente do Prisma para se comunicar com o banco de dados
const prisma = new PrismaClient();

/**
 * SCRIPT DE SEED (Semeação do Banco de Dados)
 * 
 * O que é um Seed?
 * É um script executado para popular o banco de dados com dados iniciais fictícios ou de configuração.
 * Isso é muito útil para que qualquer desenvolvedor que baixe o projeto consiga rodar a aplicação 
 * imediatamente com dados de teste pré-cadastrados (como usuários e salas de exemplo).
 * 
 * Como executar?
 * Você pode rodar este script com o comando: `npm run db:seed` (que por baixo dos panos executa `node prisma/seed.js`).
 */
async function main() {
  console.log('🌱 Iniciando semeação do banco de dados (seed)...');

  // ---------------------------------------------------------
  // LIMPEZA DO BANCO DE DADOS
  // ---------------------------------------------------------
  // A ordem de deleção é IMPORTANTE!
  // Como as Reservas dependem de Usuários e Salas (Chaves Estrangeiras),
  // se tentarmos deletar um Usuário antes de deletar as suas Reservas, o banco de dados
  // retornará um erro de violação de integridade referencial.
  // Por isso, limpamos a tabela de Reserva primeiro.
  console.log('🗑️  Limpando registros existentes...');
  await prisma.reserva.deleteMany({}); // Deleta todas as reservas
  await prisma.usuario.deleteMany({}); // Deleta todos os usuários
  await prisma.sala.deleteMany({});    // Deleta todas as salas

  // ---------------------------------------------------------
  // 1. CRIANDO USUÁRIOS DE TESTE
  // ---------------------------------------------------------
  console.log('👤 Criando usuários...');
  
  // Criamos um usuário com perfil de administrador
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador Coworking',
      email: 'admin@coworking.com',
      senha: 'admin123', // ATENÇÃO: Senha em texto puro para simplificar o exemplo. O ideal é criptografar!
      telefone: '11999999999',
      cpf: '123.456.789-00',
      eAdmin: true,
    },
  });

  // Criamos um usuário comum (membro do coworking)
  const membro = await prisma.usuario.create({
    data: {
      nome: 'João Silva (Membro)',
      email: 'membro@coworking.com',
      senha: 'membro123',
      telefone: '11988888888',
      cpf: '987.654.321-99',
      eAdmin: false,
    },
  });

  // ---------------------------------------------------------
  // 2. CRIANDO SALAS DE COWORKING
  // ---------------------------------------------------------
  console.log('🏢 Criando salas...');
  
  const salaAuditorio = await prisma.sala.create({
    data: {
      nome: 'Sala Auditório',
      capacidade: 50,
      descricao: 'Espaço amplo para palestras e eventos.',
      precoLocacao: 150.00,
    },
  });

  const salaReunioesA = await prisma.sala.create({
    data: {
      nome: 'Sala Reuniões A',
      capacidade: 10,
      descricao: 'Sala de reuniões executiva com projetor.',
      precoLocacao: 70.00,
    },
  });

  const cabineIndividual = await prisma.sala.create({
    data: {
      nome: 'Cabine Individual',
      capacidade: 1,
      descricao: 'Cabine privativa para chamadas de vídeo.',
      precoLocacao: 15.00,
    },
  });

  // ---------------------------------------------------------
  // 3. CRIANDO RESERVA DE EXEMPLO
  // ---------------------------------------------------------
  console.log('📅 Criando reserva de exemplo...');
  
  // Calculamos a data de amanhã para a reserva de teste
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  amanha.setHours(0, 0, 0, 0);

  await prisma.reserva.create({
    data: {
      idUsuario: membro.id,      // Associa a reserva ao ID do usuário 'membro' que acabamos de criar
      idSala: salaReunioesA.id,  // Associa a reserva ao ID da sala 'Sala Reuniões A'
      dia: amanha,
      turno: 'TARDE',            // Pode ser MANHA, TARDE ou NOITE
    },
  });

  console.log('🚀 Seed executado com sucesso! Banco populado e pronto.');
}

// Execução da função principal com tratamento de fluxo e encerramento de conexão
main()
  .then(async () => {
    // Após terminar com sucesso, desconecta o cliente do Prisma para liberar os recursos do banco
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Se ocorrer algum erro durante a execução, mostra o erro no console
    console.error('❌ Ocorreu um erro ao rodar o seed:', e);
    // Desconecta o cliente mesmo em caso de erro
    await prisma.$disconnect();
    // Encerra o processo do Node.js com código de erro 1
    process.exit(1);
  });
