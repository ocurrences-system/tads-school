import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.senha !== senha) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const { senha: _, ...userData } = user;
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
