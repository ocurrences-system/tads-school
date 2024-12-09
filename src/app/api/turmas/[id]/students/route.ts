import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const students = await prisma.student.findMany({
      where: { turmaId: id },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error(`Erro ao buscar alunos da turma ${id}:`, error);
    return NextResponse.json({ error: "Erro ao buscar alunos" }, { status: 500 });
  }
}
