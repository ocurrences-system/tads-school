/*
  Warnings:

  - You are about to drop the column `tipo` on the `Occurrence` table. All the data in the column will be lost.
  - You are about to drop the column `turma` on the `Student` table. All the data in the column will be lost.
  - Added the required column `tipoId` to the `Occurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turmaId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Turma" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tipo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "gravidade" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "TipoCounter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alunoId" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TipoCounter_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TipoCounter_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "Tipo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Occurrence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alunoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "tipoId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "decisao" TEXT NOT NULL,
    CONSTRAINT "Occurrence_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "Tipo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Occurrence_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Occurrence_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Occurrence" ("alunoId", "data", "decisao", "descricao", "id", "usuarioId") SELECT "alunoId", "data", "decisao", "descricao", "id", "usuarioId" FROM "Occurrence";
DROP TABLE "Occurrence";
ALTER TABLE "new_Occurrence" RENAME TO "Occurrence";
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    CONSTRAINT "Student_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("data_nascimento", "email", "id", "nome") SELECT "data_nascimento", "email", "id", "nome" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Turma_nome_key" ON "Turma"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_nome_key" ON "Tipo"("nome");
