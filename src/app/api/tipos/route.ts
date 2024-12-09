import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tipos = await prisma.tipo.findMany();
  return NextResponse.json(tipos);
}

export async function POST(request: Request) {
  const { nome, gravidade } = await request.json();
  if (!nome || !gravidade) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const tipo = await prisma.tipo.create({ data: { nome, gravidade } });
  return NextResponse.json(tipo, { status: 201 });
}
