import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todas as ocorrências de um aluno específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const occurrences = await prisma.occurrence.findMany({
      where: { alunoId: id },
      include: { tipo: true }, // Inclui os dados do tipo de ocorrência
    });

    return NextResponse.json(occurrences, { status: 200 });
  } catch (error) {
    console.error(`Erro ao buscar ocorrências do aluno ${id}:`, error);
    return NextResponse.json({ error: "Erro ao buscar ocorrências" }, { status: 500 });
  }
}
