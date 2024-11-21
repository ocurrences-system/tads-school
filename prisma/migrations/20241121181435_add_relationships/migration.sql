/*
  Warnings:

  - You are about to drop the column `aluno` on the `Occurrence` table. All the data in the column will be lost.
  - Added the required column `alunoId` to the `Occurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Occurrence` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Occurrence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alunoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "decisao" TEXT NOT NULL,
    CONSTRAINT "Occurrence_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Occurrence_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Occurrence" ("data", "decisao", "descricao", "id", "tipo") SELECT "data", "decisao", "descricao", "id", "tipo" FROM "Occurrence";
DROP TABLE "Occurrence";
ALTER TABLE "new_Occurrence" RENAME TO "Occurrence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
