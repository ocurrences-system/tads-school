import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Criar um novo aluno
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, turmaId, dataNascimento } = body;

    if (!nome || !email || !turmaId || !dataNascimento) {
      return NextResponse.json(
        { error: "Nome, email, turma e data de nascimento são obrigatórios" },
        { status: 400 }
      );
    }

    const novoAluno = await prisma.student.create({
      data: {
        nome,
        email,
        turmaId,
        dataNascimento: new Date(dataNascimento),
      },
    });

    return NextResponse.json(novoAluno, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    return NextResponse.json({ error: "Erro ao criar aluno" }, { status: 500 });
  }
}
