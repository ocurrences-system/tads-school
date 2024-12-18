import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const turmas = await prisma.turma.findMany();
    //console.log("Turmas recebidas:", turmas);
    return NextResponse.json(turmas, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return NextResponse.json({ error: "Erro ao buscar turmas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const turma = await prisma.turma.create({
      data: {
        nome: data.nome,
        ano: data.ano,
      },
    });

    return NextResponse.json(turma, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    return NextResponse.json({ error: "Erro ao criar turma." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
