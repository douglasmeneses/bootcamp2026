import prisma from "../config/prisma.js";

/**
 * Serviço de Autenticação (authService)
 * 
 * 💡 Explicação para iniciantes:
 * A camada Service é onde fica a "Inteligência / Regra de Negócio" da aplicação.
 * Responsabilidades do Service:
 * 1. Consultar e gravar dados utilizando o Prisma ORM.
 * 2. Validar regras de negócio (ex: verificar se usuário existe, se a senha confere).
 * 3. Sanitizar dados de saída (ex: remover a senha antes de responder ao cliente).
 * 4. Lançar erros personalizados com `error.status` apropriado (ex: 401 Unauthorized).
 */

/**
 * Autentica um usuário comparando email e senha com os registros do banco de dados.
 * 
 * 🛠️ Passos executados:
 * 1. `prisma.usuario.findUnique`: Busca o usuário pela chave única (email).
 * 2. Validação: Se não encontrar ou se a senha for incorreta, lança um erro HTTP 401.
 * 3. Destructuring `{ senha: _, ...usuarioSemSenha }`: Remove o campo `senha` da resposta para segurança.
 * 
 * @param {Object} credentials - Objeto contendo as credenciais de acesso
 * @param {string} credentials.email - E-mail do usuário
 * @param {string} credentials.senha - Senha em texto puro do usuário
 * @returns {Promise<{message: string, usuario: Object}>} Objeto com mensagem de sucesso e dados do usuário (sem a senha)
 * @throws {Error} Lança um erro HTTP 401 (Unauthorized) se as credenciais forem inválidas
 */
export async function loginUsuario({ email, senha }) {
  // 1. Buscar usuário cadastrado pelo e-mail no banco
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  // 2. Verificar se o usuário existe e se a senha confere
  if (!usuario || usuario.senha !== senha) {
    const error = new Error("E-mail ou senha inválidos.");
    error.status = 401; // HTTP 401: Unauthorized (Não autorizado)
    throw error;
  }

  // 3. Criar uma cópia do usuário e remover a senha por motivos de segurança
  const usuarioSemSenha = { ...usuario };
  delete usuarioSemSenha.senha;

  return {
    message: "Login realizado com sucesso.",
    usuario: usuarioSemSenha,
  };
}
