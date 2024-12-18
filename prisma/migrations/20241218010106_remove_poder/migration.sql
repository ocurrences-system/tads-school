/*
  Warnings:

  - You are about to drop the column `poder` on the `Funcao` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Funcao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);
INSERT INTO "new_Funcao" ("id", "nome") SELECT "id", "nome" FROM "Funcao";
DROP TABLE "Funcao";
ALTER TABLE "new_Funcao" RENAME TO "Funcao";
CREATE UNIQUE INDEX "Funcao_nome_key" ON "Funcao"("nome");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
