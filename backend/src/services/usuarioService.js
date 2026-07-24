import prisma from "../config/prisma.js";

/**
 * Serviço de Usuários (usuarioService)
 * 
 * 💡 Explicação para iniciantes (Arquitetura em Camadas):
 * - **Separação de Conceitos**: O Controller lida apenas com requisições HTTP (req, res), validações de rota e envio de respostas. O Service lida com regras de negócio e comunicação direta com o Banco de Dados (via ORM Prisma).
 * - **Reutilização**: Vários controllers ou tarefas agendadas podem usar as mesmas funções de serviço sem duplicar código.
 * - **Testabilidade**: Fica muito mais fácil escrever testes unitários para a lógica sem ter que simular a infraestrutura HTTP.
 */

/**
 * Cria um novo usuário no banco de dados após validar e-mail e CPF únicos.
 * 
 * 💡 Explicação para iniciantes:
 * - Usamos `async/await` porque consultas ao banco de dados são operações assíncronas (demoram um tempo para a rede/disco responderem).
 * - Lançamos erros (`throw error`) com propriedades `.status` (ex: 409 Conflict) para que o middleware de erros do Express intercepte e responda ao cliente com o código HTTP adequado.
 * 
 * @param {Object} data - Dados do usuário a ser cadastrado
 * @param {string} data.nome - Nome completo
 * @param {string} data.email - E-mail único
 * @param {string} data.senha - Senha de acesso
 * @param {string} data.telefone - Telefone de contato
 * @param {string} data.cpf - CPF único
 * @returns {Promise<Object>} Objeto do usuário criado no banco de dados
 * @throws {Error} Erro HTTP 409 Conflict se e-mail ou CPF já estiverem cadastrados
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
  return await prisma.usuario.create({
    data: { nome, email, senha, telefone, cpf },
  });
}

/**
 * Retorna a lista de todos os usuários cadastrados no banco de dados.
 * 
 * @returns {Promise<Array>} Lista de usuários encontrados
 */
export async function getAllUsuarios() {
  return await prisma.usuario.findMany();
}

/**
 * Busca os dados de um único usuário através do seu ID.
 * 
 * 💡 Explicação para iniciantes:
 * - Se o banco não encontrar o usuário com o ID fornecido, o Prisma retorna `null`.
 * - Sempre verifique a existência do registro retornado. Se for `null`, lance um erro de "não encontrado" (HTTP 404).
 * 
 * @param {number} id - Identificador único do usuário
 * @returns {Promise<Object>} Dados do usuário encontrado
 * @throws {Error} Erro HTTP 404 Not Found se o usuário não for encontrado
 */
export async function getUsuarioById(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
  });

  if (!usuario) {
    const error = new Error("Usuário não encontrado.");
    error.status = 404; // HTTP 404: Not Found
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return usuario;
}

/**
 * Atualiza as informações de um usuário existente pelo seu ID.
 * 
 * @param {number} id - ID do usuário a ser atualizado
 * @param {Object} data - Objeto contendo os campos a modificar
 * @param {string} [data.nome] - Novo nome
 * @param {string} [data.email] - Novo e-mail
 * @param {string} [data.senha] - Nova senha
 * @param {string} [data.telefone] - Novo telefone
 * @param {string} [data.cpf] - Novo CPF
 * @returns {Promise<Object>} Objeto do usuário atualizado
 * @throws {Error} Erro HTTP 404 (Não encontrado) ou HTTP 409 (Conflito de e-mail/CPF)
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

  // 4. Executar a atualização no banco de dados
  return await prisma.usuario.update({
    where: { id },
    data: { nome, email, senha, telefone, cpf },
  });
}

/**
 * Remove um usuário permanentemente do banco de dados (Hard Delete).
 * 
 * @param {number} id - Identificador único do usuário a ser excluído
 * @returns {Promise<{success: boolean, message: string}>} Mensagem de confirmação de exclusão
 * @throws {Error} Erro HTTP 404 Not Found se o usuário não for encontrado
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

  // 2. Deletar usuário do banco
  await prisma.usuario.delete({
    where: { id },
  });

  return { success: true, message: "Usuário deletado com sucesso." };
}
