# 🏢 Sistema de Gestão e Reserva de Coworking

Bem-vindo ao projeto de gestão e reserva de salas de coworking! Este guia foi preparado especialmente para desenvolvedores juniores que estão começando a explorar a base de código. Aqui você encontrará uma explicação detalhada sobre a arquitetura do projeto, fluxo de dados, banco de dados e instruções de como rodar e evoluir o sistema.

---

## 🛠️ Arquitetura do Projeto (Camadas)

A nossa aplicação backend segue uma **Arquitetura em Camadas (Layered Architecture)**. Essa divisão facilita a manutenção, teste e escalabilidade do código.

O fluxo de uma requisição HTTP funciona da seguinte forma:

```
[Cliente (ex: Frontend/Postman)] 
        │ (Envia requisição HTTP, ex: POST /api/usuarios)
        ▼
[Servidor Express (server.js)]
        │ (Aplica Middlewares de CORS, JSON parsing, etc.)
        ▼
[Roteador Central (routes/index.js -> routes/usuarioRoutes.js)]
        │ (Mapeia a URL para o método correto do Controller)
        ▼
[Controlador (controllers/usuarioController.js)]
        │ (Extrai parâmetros, chama o Service, responde HTTP status/JSON)
        ▼
[Serviço (services/usuarioService.js)]
        │ (Aplica regras de negócio e validações)
        ▼
[ORM Prisma (prisma/schema.prisma)]
        │ (Traduz chamadas JS para linguagem do banco de dados)
        ▼
[Banco de Dados (SQLite - dev.db)]
```

### Detalhes de Cada Pasta (`src/`):

1. **`server.js` (Ponto de Entrada)**: Inicializa o servidor Express, configura os middlewares básicos (como CORS e parser JSON) e registra o tratador central de erros.
2. **`config/`**: Contém configurações de ferramentas externas. Aqui, configuramos a inicialização única do **Prisma Client** (`prisma.js`).
3. **`routes/`**: Define os caminhos de URL (endpoints) que o cliente pode acessar e qual método do Controller deve gerenciar aquela URL.
4. **`controllers/`**: É o "porteiro" das requisições. Ele pega os dados vindos do cliente (como corpo da requisição `req.body` ou parâmetros de rota `req.params`), delega o trabalho pesado para o *Service* e envia a resposta apropriada (`res.json`).
5. **`services/`**: É o cérebro da aplicação. Onde moram as regras de negócio. Exemplo: "Não permitir cadastrar dois usuários com o mesmo e-mail".

---

## 🗄️ Banco de Dados (Prisma ORM & SQLite)

Nós utilizamos o **Prisma ORM** para mapear nossa estrutura de banco de dados diretamente em objetos JavaScript. O arquivo principal de configuração é o [schema.prisma](file:///C:/Users/douga/OneDrive/Área de Trabalho/bootcamp/coworking app/backend/prisma/schema.prisma).

### O Modelo de Dados

O banco possui 3 tabelas interligadas:

1. **`Usuario`**: Armazena as pessoas cadastradas (Clientes e Administradores).
2. **`Sala`**: Armazena as salas físicas do coworking disponíveis para locação.
3. **`Reserva`**: Tabela intermediária que registra qual **Usuario** reservou qual **Sala** em um determinado **dia** e **turno**.

#### Relacionamentos (1-para-Muitos):
- Um **Usuário** pode ter *muitas* **Reservas**.
- Uma **Sala** pode ter *muitas* **Reservas**.
- A deleção está configurada como `onDelete: Cascade`. Significa que se você deletar um usuário ou uma sala, todas as reservas associadas a eles serão automaticamente removidas pelo banco.

---

## 🚀 Como Rodar o Projeto na sua Máquina

### 1. Pré-requisitos
Certifique-se de ter instalado em seu computador:
- **Node.js** (versão 18 ou superior recomendada)
- **NPM** (gerenciador de pacotes que vem junto com o Node)

### 2. Instalar Dependências
Entre na pasta `backend` pelo seu terminal e execute:
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz da pasta `backend` (ou copie o `.env.example`) e configure as variáveis. 
Para desenvolvimento local com SQLite, basta ter:
```env
PORT=3000
DATABASE_URL="file:./dev.db"
```

### 4. Rodar as Migrações do Banco de Dados
As migrações (*migrations*) são como um histórico de controle de versão para o seu banco. Para criar as tabelas físicas no arquivo `dev.db`, execute:
```bash
npm run db:migrate
```

### 5. Popular o Banco (Seed)
Para não começar com o banco vazio, nós criamos um script para semeá-lo com dados fictícios. Execute:
```bash
npm run db:seed
```
*Isso criará 2 usuários (um administrador e um membro), 3 salas e 1 reserva.*

### 6. Iniciar o Servidor de Desenvolvimento
Agora você pode ligar a API executando:
```bash
npm run dev
```
O servidor iniciará em `http://localhost:3000`.

---

## 💡 Conceitos Fundamentais para Entender o Código

### 1. `async/await` e Operações Assíncronas
A comunicação com bancos de dados e redes não é instantânea. Por isso usamos `async/await` no JavaScript. O `await` diz para o Node suspender a execução daquela função até que a promessa (*Promise*) seja resolvida (ex: o banco responder), sem travar a aplicação inteira para outros usuários.

### 2. Tratamento de Erros Global (Middlewares)
Repare que nos controllers nós usamos blocos `try/catch` e passamos o erro adiante com `next(err)`. 
No [server.js](file:///C:/Users/douga/OneDrive/Área de Trabalho/bootcamp/coworking app/backend/src/server.js) definimos um middleware de erro especial:
```javascript
app.use((err, req, res, next) => { ... })
```
Ele centraliza todas as respostas de erro. Assim, garantimos que qualquer falha na nossa aplicação sempre será respondida em formato JSON consistente e legível para quem consome nossa API.

### 3. Segurança de Senhas (Melhoria Futura)
Atualmente, as senhas estão salvas em texto puro (ex: `membro123`) no banco de dados. Isso é uma **falha grave de segurança** no mundo real.
*   **O que fazer em produção?** Devemos usar uma biblioteca chamada `bcrypt` ou `argon2` para gerar um *hash* seguro da senha antes de persistir no banco.

---

## 🔗 Endpoints Disponíveis da API

### Geral
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Verifica a integridade e tempo online da API |
| **GET** | `/docs` | Documentação interativa Swagger UI |

### Autenticação
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Realiza autenticação com e-mail e senha |

### Usuários
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/usuarios` | Lista todos os usuários cadastrados |
| **POST** | `/api/usuarios` | Cadastra um novo usuário |
| **GET** | `/api/usuarios/:id` | Busca detalhes de um usuário específico |
| **PUT** | `/api/usuarios/:id` | Atualiza informações de um usuário |
| **DELETE** | `/api/usuarios/:id` | Exclui um usuário e suas reservas |

### Salas
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/salas` | Lista todas as salas (suporta filtros `disponivel=true`, `dia`, `turno`) |
| **POST** | `/api/salas` | Cadastra uma nova sala |
| **GET** | `/api/salas/:id` | Busca detalhes de uma sala específica |
| **PUT** | `/api/salas/:id` | Atualiza informações de uma sala |
| **DELETE** | `/api/salas/:id` | Exclui uma sala e suas reservas |

### Reservas
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/reservas` | Lista todas as reservas com relacionamentos |
| **POST** | `/api/reservas` | Cria uma nova reserva de sala |
| **GET** | `/api/reservas/:id` | Busca detalhes de uma reserva específica |
| **DELETE** | `/api/reservas/:id` | Exclui uma reserva |
