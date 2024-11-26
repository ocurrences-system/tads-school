import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Retorna os dados de um aluno específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { turma: true }, // Inclui os dados da turma do aluno
    });

    if (!student) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error(`Erro ao buscar aluno ${id}:`, error);
    return NextResponse.json({ error: "Erro ao buscar aluno" }, { status: 500 });
  }
}
