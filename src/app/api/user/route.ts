import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        // Obtém a sessão do usuário autenticado
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
        }

        // Busca o usuário no banco de dados com base no ID da sessão
        const user = await prisma.user.findUnique({
            where: { login },
            select: {
                id: true,
                nome: true,
                login: true,
                senha: true,
                funcao: {
                    select: {
                        nome: true,
                    },
                },
                foto: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        return NextResponse.json({ message: "Erro no servidor" }, { status: 500 });
    }
}
