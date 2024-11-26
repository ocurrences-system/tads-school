import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Lista todas as turmas
export async function GET() {
  try {
    const turmas = await prisma.turma.findMany();
    return NextResponse.json(turmas, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return NextResponse.json({ error: "Erro ao buscar turmas" }, { status: 500 });
  }
}
