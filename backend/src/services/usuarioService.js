import prisma from "../config/prisma.js";

/**
 * CAMADA DE SERVIÇOS (Services)
 * 
 * O que é?
 * É onde colocamos a "Lógica de Negócios" da nossa aplicação.
 * 
 * Por que usar esta camada? (Arquitetura em Camadas / Layered Architecture)
 * - Separação de Conceitos: O Controller lida apenas com requisições HTTP (req, res), validações de rota e envio de respostas. O Service lida com regras de negócio e comunicação direta com o Banco de Dados (via ORM Prisma).
 * - Reutilização: Vários controllers ou tarefas agendadas podem usar as mesmas funções de serviço sem duplicar código.
 * - Testabilidade: Fica muito mais fácil escrever testes unitários para a lógica sem ter que simular toda a infraestrutura HTTP de requisições.
 * 
 * TRADE-OFFS da Camada de Serviço:
 * - Prós: Código muito mais limpo, modular, escalável e fácil de testar.
 * - Contras: Para projetos extremamente simples (CRUDs básicos), pode parecer que estamos apenas escrevendo uma camada a mais que "repassa" dados do Controller para o Banco de Dados (código boilerplate).
 */

/**
 * CRIA UM NOVO USUÁRIO
 * 
 * Explicação para iniciantes:
 * - Usamos `async/await` porque consultas ao banco de dados são operações assíncronas (demoram um tempo para rede/disco responderem).
 * - Lançamos erros (`throw error`) com propriedades adicionais (.status e .code) para que o middleware de erros do Express intercepte e responda com o status HTTP correto para o cliente.
 * 
 * Segurança (AVISO IMPORTANTE DE SEGURANÇA):
 * - Atualmente, o campo `senha` está sendo salvo em TEXTO PURO no banco de dados. 
 * - TRADE-OFF / SEGURANÇA: Salvar senhas sem criptografia é uma falha grave. Deveríamos usar uma biblioteca como `bcrypt` para gerar um hash da senha antes de salvá-la no banco.
 * 
 * Validação no App vs Validação no Banco de Dados:
 * - Fazemos a verificação se o e-mail ou CPF já existem no banco usando JavaScript (`prisma.usuario.findUnique`) antes de tentar criar.
 * - TRADE-OFF:
 *   - Fazer no App: Permite retornar erros amigáveis e específicos de forma simples.
 *   - Fazer no Banco (Unique Constraints): É o mecanismo de segurança definitivo do banco de dados que previne duplicidade. Em sistemas concorrentes (duas requisições idênticas enviadas exatamente no mesmo milissegundo), a validação em JS pode falhar (Race Condition), mas a do banco sempre segurará a barra. O ideal é usar ambas!
 */
export async function createUsuario(data) {
  const { nome, email, senha, telefone, cpf } = data;

  // 1. Validar se o e-mail já está cadastrado
  const emailExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (emailExistente) {
    const error = new Error("E-mail já cadastrado.");
    error.status = 409; // HTTP 409: Conflict (Conflito de estado)
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  // 2. Validar se o CPF já está cadastrado
  const cpfExistente = await prisma.usuario.findUnique({
    where: { cpf },
  });
  if (cpfExistente) {
    const error = new Error("CPF já cadastrado.");
    error.status = 409; // HTTP 409: Conflict
    error.code = "CPF_ALREADY_EXISTS";
    throw error;
  }

  // 3. Criar usuário (eAdmin assume o valor default do banco: false)
  // TRADE-OFF: Aqui enviamos diretamente a senha pura do usuário. 
  // TODO: Fazer hash da senha antes de persistir, ex: `senha: await bcrypt.hash(senha, 10)`
  return await prisma.usuario.create({
    data: { nome, email, senha, telefone, cpf },
  });
}

/**
 * BUSCA TODOS OS USUÁRIOS
 * 
 * TRADE-OFFS / PAGINAÇÃO:
 * - Prós: Extremamente simples de entender e implementar (`findMany`).
 * - Contras: Traz TODOS os registros do banco de uma vez. Se o banco tiver 100.000 usuários, essa chamada causará problemas de performance (lentidão e alto consumo de memória).
 * - Melhoria futura: Adicionar paginação (ex: limites e offsets como `skip: 0, take: 10`) nas consultas de listagem à medida que a aplicação crescer.
 */
export async function getAllUsuarios() {
  return await prisma.usuario.findMany();
}

/**
 * BUSCA USUÁRIO POR ID
 * 
 * Explicação para iniciantes:
 * - Se o banco não encontrar o usuário com o ID fornecido, o Prisma retorna `null`.
 * - Sempre verifique a existência do registro retornado. Se for `null`, lance um erro de "não encontrado" imediatamente.
 */
export async function getUsuarioById(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404; // HTTP 404: Not Found (Recurso não encontrado)
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return usuario;
}

/**
 * ATUALIZA USUÁRIO POR ID
 * 
 * Explicação para iniciantes:
 * - Fazemos verificações condicionais (`if (email && email !== usuario.email)`) para evitar fazer queries desnecessárias de duplicidade caso o campo de e-mail ou CPF não tenha sido enviado na atualização ou não tenha mudado.
 * 
 * TRADE-OFF / PATCH vs PUT:
 * - Esse método atualiza os campos que forem enviados. Se usássemos um padrão purista de PUT, teríamos que exigir que todo o objeto do usuário fosse enviado novamente. 
 * - Usar validações seletivas como as abaixo nos aproxima do comportamento de um PATCH (atualização parcial).
 */
export async function updateUsuario(id, data) {
  const { nome, email, senha, telefone, cpf } = data;

  // 1. Verificar se o usuário existe
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });
  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404; // HTTP 404: Not Found
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  // 2. Se for atualizar email e ele for diferente do e-mail atual do usuário, verificar unicidade
  if (email && email !== usuario.email) {
    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });
    if (emailExistente) {
      const error = new Error("E-mail já em uso por outro usuário.");
      error.status = 409; // HTTP 409: Conflict
      error.code = "EMAIL_ALREADY_EXISTS";
      throw error;
    }
  }

  // 3. Se for atualizar CPF e ele for diferente do CPF atual do usuário, verificar unicidade
  if (cpf && cpf !== usuario.cpf) {
    const cpfExistente = await prisma.usuario.findUnique({
      where: { cpf },
    });
    if (cpfExistente) {
      const error = new Error("CPF já em uso por outro usuário.");
      error.status = 409; // HTTP 409: Conflict
      error.code = "CPF_ALREADY_EXISTS";
      throw error;
    }
  }

  // 4. Executar a atualização (sem modificar eAdmin)
  return await prisma.usuario.update({
    where: { id },
    data: { nome, email, senha, telefone, cpf },
  });
}

/**
 * DELETA USUÁRIO POR ID
 * 
 * TRADE-OFFS / HARD DELETE vs SOFT DELETE:
 * - Hard Delete (Físico): Remove permanentemente o registro da tabela usando `prisma.usuario.delete`.
 *   - Prós: Libera espaço no banco de dados imediatamente; é a implementação mais simples.
 *   - Contras: Perda definitiva de dados históricos. Se o usuário deletar a conta por engano, não é possível recuperar sem um backup completo. Além disso, se houver chaves estrangeiras vinculadas a este usuário, a deleção falhará (ou causará deleção em cascata).
 * - Soft Delete (Lógico): Em vez de apagar, mudamos uma coluna (ex: `deletadoEm: DateTime` ou `ativo: Boolean`). 
 *   - Prós: Mantém histórico e integridade referencial; permite restaurar contas.
 *   - Contras: Aumenta o volume de dados ativos no banco e todas as outras consultas (getAll, getById) precisam ser modificadas para filtrar registros excluídos (ex: `where: { ativo: true }`).
 */
export async function deleteUsuario(id) {
  // 1. Verificar se o usuário existe
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404; // HTTP 404: Not Found
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  // 2. Deletar usuário (Hard Delete)
  await prisma.usuario.delete({
    where: { id },
  });

  return { success: true, message: "Usuário deletado com sucesso." };
}
