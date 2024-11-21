import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllOccurrences() {
  return await prisma.occurrence.findMany({
    include: {
      aluno: true, 
      usuario: true, 
    },
  });
}

export async function createOccurrence({
  alunoId,
  usuarioId,
  data,
  tipo,
  descricao,
  decisao,
}: {
  alunoId: string;
  usuarioId: string;
  data: string;
  tipo: string;
  descricao: string;
  decisao: string;
}) {
  return await prisma.occurrence.create({
    data: {
      alunoId,
      usuarioId,
      data: new Date(data),
      tipo,
      descricao,
      decisao,
    },
  });
}

export async function deleteOccurrence(id: string) {
  return await prisma.occurrence.delete({
    where: { id },
  });
}
