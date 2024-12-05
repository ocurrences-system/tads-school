import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();

    // Busca o usuário pelo email no banco de dados
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Verifica se o usuário existe e a senha está correta
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    // Remove a senha antes de retornar os dados do usuário
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
