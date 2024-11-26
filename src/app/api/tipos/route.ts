import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Listar todos os tipos de ocorrência
export async function GET() {
  const tipos = await prisma.tipo.findMany();
  return NextResponse.json(tipos);
}

// POST - Criar um novo tipo de ocorrência
export async function POST(request: Request) {
  const { nome, gravidade } = await request.json();
  if (!nome || !gravidade) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const tipo = await prisma.tipo.create({ data: { nome, gravidade } });
  return NextResponse.json(tipo, { status: 201 });
}
