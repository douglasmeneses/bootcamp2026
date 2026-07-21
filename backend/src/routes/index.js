import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes.js";
import salaRoutes from "./salaRoutes.js";
import reservaRoutes from "./reservaRoutes.js";
import authRoutes from "./authRoutes.js";

/**
 * ROTEADOR CENTRAL (Index Router)
 * 
 * O que é?
 * É o arquivo central que agrupa e organiza todas as rotas da nossa aplicação.
 * Em vez de registrar dezenas de rotas diretamente no `server.js`, nós agrupamos as rotas
 * em pequenos arquivos separados (módulos) e depois as acoplamos aqui neste roteador central.
 * 
 * Por que usar o Router do Express?
 * - Modularização: Permite separar as rotas por recurso (ex: usuários, salas, reservas).
 * - Organização: Deixa o ponto de partida do servidor (server.js) limpo e focado em configurações gerais.
 */
const router = Router();

/**
 * ROTA DE HEALTH CHECK (Verificação de Saúde da API)
 * Endpoint: GET /api/health
 * 
 * Para que serve?
 * É um padrão do mercado usado para monitorar se a API está online e respondendo.
 * Ferramentas de deploy e monitoramento (como Docker, Kubernetes, AWS, etc.) batem nesse
 * endpoint periodicamente para saber se a aplicação está saudável.
 */
router.get("/health", (req, res) => {
  return res.json({
    status: "OK",
    uptime: process.uptime(), // Retorna há quantos segundos o servidor Node.js está rodando
    timestamp: new Date().toISOString(), // Data e hora atual no formato ISO
  });
});

/**
 * ROTA BASE / BOAS-VINDAS
 * Endpoint: GET /api/
 */
router.get("/", (req, res) => {
  return res.json({
    message: "Bem-vindo à API do Sistema de Gestão e Reserva de Coworking!",
    version: "1.0.0",
  });
});

/**
 * ROTAS DOS MÓDULOS DA APLICAÇÃO
 */
router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/salas", salaRoutes);
router.use("/reservas", reservaRoutes);

export default router;
