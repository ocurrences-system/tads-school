/*
  Warnings:

  - A unique constraint covering the columns `[alunoId,tipoId]` on the table `TipoCounter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TipoCounter_alunoId_tipoId_key" ON "TipoCounter"("alunoId", "tipoId");
