import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Criar um novo aluno
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const aluno = await prisma.student.create({
      data: {
        nome: data.nome,
        email: data.email,
        tel: data.tel,
        telP: data.telP,
        turmaId: data.turmaId,
        data_nascimento: new Date(data.data_nascimento),
      },
    });

    return NextResponse.json(aluno, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    return NextResponse.json({ error: "Erro ao criar aluno." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
