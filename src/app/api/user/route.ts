import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    console.log(session);

    if (!session?.user?.login) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { login: session.user.login },
      select: {
        id: true,
        nome: true,
        login: true,
        foto: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return NextResponse.json({ error: "Erro interno ao buscar usuário." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
