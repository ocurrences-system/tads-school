import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const occurrences = await prisma.occurrence.findMany({
      include: {
        aluno: {
          include: {
            turma: true,
          },
        },
        tipo: true,
        usuario: true,
      },
    });

    return NextResponse.json(occurrences, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar ocorrências:", error);
    return NextResponse.json(
      { error: "Não foi possível buscar as ocorrências." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { alunoId, data, tipoId, descricao, decisao, usuarioId } = body;

    if (!alunoId || !data || !tipoId || !descricao || !usuarioId) {
      return NextResponse.json(
        {
          error:
            "Todos os campos (alunoId, data, tipoId, descricao, usuarioId) são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const aluno = await prisma.student.findUnique({ where: { id: alunoId } });
    if (!aluno) {
      return NextResponse.json(
        { error: "Aluno não encontrado com o ID fornecido." },
        { status: 404 }
      );
    }

    const tipo = await prisma.tipo.findUnique({ where: { id: tipoId } });
    if (!tipo) {
      return NextResponse.json(
        { error: "Tipo de ocorrência não encontrado com o ID fornecido." },
        { status: 404 }
      );
    }

    const usuario = await prisma.user.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado com o ID fornecido." },
        { status: 404 }
      );
    }

    const newOccurrence = await prisma.occurrence.create({
      data: {
        alunoId,
        usuarioId,
        tipoId,
        data: new Date(data),
        descricao,
        decisao: decisao || "",
      },
    });

    await prisma.tipoCounter.upsert({
      where: {
        alunoId_tipoId: {
          alunoId,
          tipoId,
        },
      },
      create: {
        alunoId,
        tipoId,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(newOccurrence, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar ocorrência:", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Erro de integridade referencial: aluno, usuário ou tipo inválido.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao criar ocorrência." },
      { status: 500 }
    );
  }
}
