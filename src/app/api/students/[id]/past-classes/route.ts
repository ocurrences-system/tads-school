import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Retorna as turmas passadas de um aluno
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Valida o ID do aluno
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });
    }

    // Busca as turmas passadas
    const pastClasses = await prisma.turma.findMany({
      where: {
        alunos: {
          some: {
            id,
          },
        },
        NOT: {
          id: student.turmaId, // Exclui a turma atual
        },
      },
    });

    return NextResponse.json(pastClasses, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar turmas passadas:", error);
    return NextResponse.json({ error: "Erro ao buscar turmas passadas." }, { status: 500 });
  }
}
