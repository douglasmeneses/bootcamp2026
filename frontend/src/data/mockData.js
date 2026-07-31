// =========================================================
// Dados Mockados (simulação de dados do backend)
// Este arquivo centraliza todos os dados de exemplo
// utilizados nas telas do frontend durante o desenvolvimento.
// Futuramente, esses dados virão de chamadas à API.
// =========================================================

// Reservas do usuário logado (visão "Minhas Reservas")
export const salasDisponiveis = [
  {
    id: 1,
    nome: "Sala Auditório",
    capacidade: 50,
    preco: 150,
    descricao: "Espaço amplo com projetor 4K e sistema de som profissional.",
  },
  {
    id: 2,
    nome: "Sala Reuniões A",
    capacidade: 10,
    preco: 50,
    descricao: "Mesa oval de reuniões com lousa de vidro e TV para apresentações.",
  },
  {
    id: 3,
    nome: "Sala Estúdio",
    capacidade: 8,
    preco: 40,
    descricao: "Isolamento acústico avançado e microfones para gravação de podcast.",
  },
];

export const reservasDoUsuario = [
  {
    id: 101,
    salaNome: "Sala Reuniões A",
    data: "18/07/2026",
    turno: "Tarde",
  },
  {
    id: 102,
    salaNome: "Sala Auditório",
    data: "20/07/2026",
    turno: "Manhã",
  },
];

// Dados do perfil de um usuário cliente mockado
export const usuarioLogado = {
  id: 1,
  nome: "João Silva",
  email: "joao@email.com",
  cpf: "123.456.789-00",
  telefone: "(83) 99873-5555",
  tipo: "cliente",
};

// Dados do perfil de um usuário admin mockado
export const usuarioAdminLogado = {
  nome: "Admin Sistema",
  email: "admin@email.com",
  cpf: "000.111.222-33",
  telefone: "(83) 99999-8888",
  tipo: "admin",
};

// Salas cadastradas no sistema (visão admin)
export const salasAdmin = [
  {
    id: 1,
    nome: "Sala Auditório",
    capacidade: 50,
    preco: 150,
    status: "Ativa",
    descricao: "Espaço amplo para eventos e palestras",
  },
  {
    id: 2,
    nome: "Sala Reuniões A",
    capacidade: 10,
    preco: 50,
    status: "Inativa",
    descricao: "Sala de reunião intermediária",
  },
  {
    id: 3,
    nome: "Sala Estúdio",
    capacidade: 8,
    preco: 40,
    status: "Inativa",
    descricao: "Sala de gravação com isolamento acústico",
  },
];

// Todas as reservas do sistema (visão admin)
export const reservasAdmin = [
  {
    id: 201,
    usuario: "João Silva",
    sala: "Sala Reuniões A",
    data: "18/07/2026",
    turno: "Tarde",
  },
  {
    id: 202,
    usuario: "Maria Santos",
    sala: "Sala Auditório",
    data: "20/07/2026",
    turno: "Manhã",
  },
  {
    id: 203,
    usuario: "Carlos Oliveira",
    sala: "Sala Estúdio",
    data: "22/07/2026",
    turno: "Noite",
  },
];

// Todos os usuários do sistema (visão admin)
export const usuariosAdmin = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    cpf: "123.456.789-00",
    telefone: "(83) 99873-5555",
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@email.com",
    cpf: "987.654.321-00",
    telefone: "(11) 98765-4321",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    email: "carlos@email.com",
    cpf: "456.789.123-00",
    telefone: "(21) 91234-5678",
  },
];
