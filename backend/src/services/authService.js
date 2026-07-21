import prisma from "../config/prisma.js";

/**
 * CAMADA DE SERVIÇOS DE AUTENTICAÇÃO (Auth Service)
 * 
 * Lógica de negócio focada em verificar credenciais e autenticar o usuário.
 * A validação de campos obrigatórios é tratada pelo Zod no middleware antes de chegar aqui.
 */

/**
 * REALIZA O LOGIN DO USUÁRIO
 */
export async function loginUsuario({ email, senha }) {
  // 1. Buscar usuário cadastrado pelo e-mail
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  // 2. Verificar se o usuário existe e se a senha está correta
  if (!usuario || usuario.senha !== senha) {
    const error = new Error("E-mail ou senha inválidos.");
    error.status = 401; // HTTP 401: Unauthorized
    throw error;
  }

  // 3. Remover a senha do objeto retornado para não expor dados sensíveis
  const { senha: _, ...usuarioSemSenha } = usuario;

  return {
    message: "Login realizado com sucesso.",
    usuario: usuarioSemSenha,
  };
}
