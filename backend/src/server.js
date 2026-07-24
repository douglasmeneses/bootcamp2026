import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env (ex: DATABASE_URL, PORT) na memória
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { ZodError } from 'zod';
import routes from './routes/index.js';
import { swaggerDocument } from './config/swagger.js';

/**
 * PONTO DE ENTRADA DO SERVIDOR (Server Entrypoint)
 * 
 * O que é o Express?
 * O Express é um framework minimalista para Node.js que facilita o desenvolvimento de aplicações web
 * e APIs HTTP. Ele nos fornece abstrações simples para gerenciar rotas, middlewares, requisições e respostas.
 */
const app = express();

// Define a porta do servidor: usa a porta configurada no .env ou assume 3000 como valor padrão
const PORT = process.env.PORT || 3000;

/**
 * MIDDLEWARES (Interceptadores / Filtros)
 */

// Configuração de CORS (Cross-Origin Resource Sharing):
app.use(cors());

// Middleware nativo do Express para interpretar (fazer o parse) do corpo das requisições formatadas como JSON.
app.use(express.json());

/**
 * DOCUMENTAÇÃO SWAGGER (Interface Gráfica da API)
 * Endpoint: GET /docs
 * 
 * 💡 Explicação para iniciantes:
 * Disponibiliza uma página interativa visual no navegador em `http://localhost:3000/docs`.
 * Nela você pode ver todos os métodos (GET, POST, PUT, DELETE), esquemas de dados e testar as requisições na prática!
 */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Montagem das Rotas da API:
// Todas as rotas registradas em `./routes/index.js` serão prefixadas com `/api`.
app.use('/api', routes);

/**
 * MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS
 * 
 * Como o Express reconhece?
 * Se uma função middleware receber exatamente 4 argumentos `(err, req, res, next)`, o Express a identifica
 * automaticamente como um middleware de tratamento de erros.
 */
app.use((err, req, res, next) => {
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
 */
app.use((req, res) => {
  return res.status(404).json({
    message: `Rota ${req.originalUrl} não encontrada.`
  });
});

// Inicialização do servidor HTTP na porta especificada
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
  console.log(`📚 Documentação Swagger disponível em: http://localhost:${PORT}/docs`);
  console.log(`🩺 Health check disponível em: http://localhost:${PORT}/api/health`);
});
