import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllStudents() {
  return await prisma.student.findMany({
    include: {
      occurrences: true, 
    },
  });
}

export async function createStudent({
  nome,
  email,
  turma,
  data_nascimento,
}: {
  nome: string;
  email: string;
  turma: string;
  data_nascimento: string;
}) {
  return await prisma.student.create({
    data: {
      nome,
      email,
      turma,
      data_nascimento: new Date(data_nascimento),
    },
  });
}

export async function deleteStudent(id: string) {
  return await prisma.student.delete({
    where: { id },
  });
}
