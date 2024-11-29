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
    "resolvida" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Occurrence_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "Tipo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Occurrence_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Occurrence_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Occurrence" ("alunoId", "data", "decisao", "descricao", "id", "tipoId", "usuarioId") SELECT "alunoId", "data", "decisao", "descricao", "id", "tipoId", "usuarioId" FROM "Occurrence";
DROP TABLE "Occurrence";
ALTER TABLE "new_Occurrence" RENAME TO "Occurrence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
