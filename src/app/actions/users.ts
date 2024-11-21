import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      occurrences: true, 
    },
  });
}

export async function createUser({
  nome,
  email,
  funcao,
  senha,
}: {
  nome: string;
  email: string;
  funcao: string;
  senha: string;
}) {
  return await prisma.user.create({
    data: { nome, email, funcao, senha },
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
