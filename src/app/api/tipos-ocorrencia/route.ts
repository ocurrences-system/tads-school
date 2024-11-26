import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todos os tipos de ocorrência
export async function GET() {
  try {
    const tipos = await prisma.tipo.findMany(); // Atualize aqui para `tipo`
    return NextResponse.json(tipos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar tipos de ocorrência:", error);
    return NextResponse.json({ error: "Erro ao buscar tipos de ocorrência" }, { status: 500 });
  }
}
