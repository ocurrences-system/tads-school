import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // Obtém o ID da ocorrência a partir da URL
    const body = await req.json(); // Obtém os dados enviados pelo frontend
    const { resolvida, decisao, descricao } = body;

    try {

        // Atualiza a ocorrência no banco de dados
        const updatedOccurrence = await prisma.occurrence.update({
            where: { id },
            data: {
              resolvida,
              decisao,
              descricao,
            },
            include: {
              tipo: true, // Inclua as relações necessárias
            },
          });

        console.log("ID da ocorrência recebido:", id);
        console.log("Dados recebidos no body:", body);
        console.log("JSON.stringify(body):", JSON.stringify(body)); // Para verificar a estrutura exata do body
        console.log("Ocorrência atualizada:", updatedOccurrence);

        return NextResponse.json(updatedOccurrence, { status: 200 }); // Retorna a ocorrência atualizada
    } catch (error) {
        console.error("Erro ao atualizar ocorrência:", error);
        return NextResponse.json(
            { error: "Erro ao atualizar ocorrência" },
            { status: 500 }
        );
    }
}
