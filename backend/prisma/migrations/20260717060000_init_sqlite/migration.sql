-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dt_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" DATETIME NOT NULL,
    "e_admin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "salas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "descricao" TEXT,
    "preco_locacao" REAL NOT NULL,
    "dt_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_atualizacao" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dia" DATETIME NOT NULL,
    "turno" TEXT NOT NULL,
    "dt_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "id_sala" INTEGER NOT NULL,
    CONSTRAINT "reservas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reservas_id_sala_fkey" FOREIGN KEY ("id_sala") REFERENCES "salas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");
