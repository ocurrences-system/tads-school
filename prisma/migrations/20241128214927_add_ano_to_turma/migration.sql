/*
  Warnings:

  - Added the required column `ano` to the `Turma` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Turma" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "ano" INTEGER NOT NULL
);
INSERT INTO "new_Turma" ("id", "nome") SELECT "id", "nome" FROM "Turma";
DROP TABLE "Turma";
ALTER TABLE "new_Turma" RENAME TO "Turma";
CREATE UNIQUE INDEX "Turma_nome_ano_key" ON "Turma"("nome", "ano");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
