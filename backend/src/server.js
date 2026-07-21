import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env (ex: DATABASE_URL, PORT) na memória
import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import routes from './routes/index.js';

/**
 * PONTO DE ENTRADA DO SERVIDOR (Server Entrypoint)
 * 
 * O que é o Express?
 * O Express é um framework minimalista para Node.js que facilita o desenvolvimento de aplicações web
 * e APIs HTTP. Ele nos fornece abrações simples para gerenciar rotas, middlewares, requisições e respostas.
 */
const app = express();

// Define a porta do servidor: usa a porta configurada no .env ou assume 3000 como valor padrão
const PORT = process.env.PORT || 3000;

/**
 * MIDDLEWARES (Interceptadores / Filtros)
 * 
 * O que é um Middleware?
 * Em termos simples, middlewares são funções que são executadas em cadeia, uma após a outra, no ciclo
 * de vida de uma requisição HTTP (desde o momento em que ela chega ao servidor até o momento em que a
 * resposta é enviada de volta). Eles servem para processar dados, fazer autenticações, logar dados, etc.
 */

// Configuração de CORS (Cross-Origin Resource Sharing):
// Permite que aplicações em domínios/portas diferentes (ex: o frontend rodando na porta 5173 do Vite)
// façam requisições HTTP para a nossa API (rodando na porta 3000) sem serem bloqueadas pelo navegador.
app.use(cors());

// Middleware nativo do Express para interpretar (fazer o parse) do corpo das requisições formatadas como JSON.
// Sem esse middleware, não conseguiríamos acessar os dados enviados no corpo via `req.body`.
app.use(express.json());

// Montagem das Rotas da API:
// Todas as rotas registradas em `./routes/index.js` serão prefixadas com `/api`.
// Exemplo: se houver uma rota `/usuarios` no arquivo de rotas, ela ficará disponível em `/api/usuarios`.
app.use('/api', routes);

/**
 * MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS
 * 
 * Como o Express reconhece?
 * Se uma função middleware receber exatamente 4 argumentos `(err, req, res, next)`, o Express a identifica
 * automaticamente como um middleware de tratamento de erros.
 */
app.use((err, req, res, next) => {
  // Exibe o erro no console do servidor para fins de depuração (debug)
  console.error('Erro detectado na aplicação:', err);

  // Tratamento especial para erros de validação do Zod
  if (err instanceof ZodError || err?.name === 'ZodError') {
    const mensagemFormata = err.errors ? err.errors.map(e => e.message).join(' ') : err.message;
    return res.status(400).json({
      message: mensagemFormata || 'Dados inválidos na requisição.'
    });
  }

  // Formato padrão de resposta de erro. Retorna o status de erro específico do objeto ou 500 (Erro Interno).
  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor.'
  });
});

/**
 * ROTA DE FALLBACK / 404 (Rota não encontrada)
 * 
 * Como funciona?
 * Se uma requisição chegar e não bater em nenhuma rota registrada acima (nem /api, nem /api/usuarios, etc.),
 * ela cairá nesta última rota. Retornamos o status HTTP 404 (Not Found).
 */
app.use((req, res) => {
  return res.status(404).json({
    message: `Rota ${req.originalUrl} não encontrada.`
  });
});

// Inicialização do servidor HTTP na porta especificada
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
  console.log(`🩺 Health check disponível em: http://localhost:${PORT}/api/health`);
});
