/*
  Warnings:

  - You are about to drop the column `foto` on the `Student` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailP" TEXT,
    "tel" TEXT,
    "telP" TEXT,
    "turmaId" TEXT NOT NULL,
    "data_nascimento" DATETIME NOT NULL,
    "fotoPath" TEXT,
    CONSTRAINT "Student_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("data_nascimento", "email", "emailP", "id", "nome", "tel", "telP", "turmaId") SELECT "data_nascimento", "email", "emailP", "id", "nome", "tel", "telP", "turmaId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
