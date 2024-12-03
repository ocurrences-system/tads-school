import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { formatDate } from "@/utils/formatDate";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const { resolvida, decisao, descricao } = body;

  try {
    const updatedOccurrence = await prisma.occurrence.update({
      where: { id },
      data: {
        resolvida,
        decisao,
        descricao,
      },
      include: {
        tipo: true,
      },
    });

    console.log("ID da ocorrência recebido:", id);
    console.log("Dados recebidos no body:", body);
    console.log("JSON.stringify(body):", JSON.stringify(body));
    console.log("Ocorrência atualizada:", updatedOccurrence);

    return NextResponse.json(updatedOccurrence, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar ocorrência:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ocorrência" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new Response("ID da ocorrência é obrigatório", { status: 400 });
  }

  try {
    await prisma.occurrence.delete({
      where: { id },
    });

    return new Response("Ocorrência excluída com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir ocorrência:", error);
    return new Response("Erro ao excluir ocorrência", { status: 500 });
  }
}

//WIP