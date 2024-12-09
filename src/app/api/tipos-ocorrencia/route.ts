import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tipos = await prisma.tipo.findMany(); // Atualize aqui para `tipo`
    return NextResponse.json(tipos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar tipos de ocorrência:", error);
    return NextResponse.json({ error: "Erro ao buscar tipos de ocorrência" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const tipo = await prisma.tipo.create({
      data: {
        nome: data.nome,
        gravidade: parseInt(data.gravidade),
      },
    });

    return NextResponse.json(tipo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tipo de ocorrência:", error);
    return NextResponse.json({ error: "Erro ao criar tipo de ocorrência." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

