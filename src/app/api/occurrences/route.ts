import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// GET - Lista todas as ocorrências
export async function GET() {
  try {
    const occurrences = await prisma.occurrence.findMany({
      include: {
        aluno: true, // Inclui os detalhes do aluno relacionado
        usuario: true, // Inclui os detalhes do usuário relacionado
        tipo: true, // Inclui os detalhes do tipo de ocorrência relacionado
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

// POST - Cria uma nova ocorrência
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { alunoId, data, tipoId, descricao, decisao, usuarioId } = body;

    // Validação dos dados recebidos
    if (!alunoId || !data || !tipoId || !descricao || !decisao || !usuarioId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Validação se o aluno existe
    const aluno = await prisma.student.findUnique({ where: { id: alunoId } });
    if (!aluno) {
      return NextResponse.json(
        { error: "Aluno não encontrado com o ID fornecido." },
        { status: 404 }
      );
    }

    // Validação se o tipo de ocorrência existe
    const tipo = await prisma.tipo.findUnique({ where: { id: tipoId } });
    if (!tipo) {
      return NextResponse.json(
        { error: "Tipo de ocorrência não encontrado com o ID fornecido." },
        { status: 404 }
      );
    }

    // Validação se o usuário existe
    const usuario = await prisma.user.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado com o ID fornecido." },
        { status: 404 }
      );
    }

    // Criação da ocorrência
    const newOccurrence = await prisma.occurrence.create({
      data: {
        alunoId,
        usuarioId,
        tipoId, // Relaciona com o tipo de ocorrência
        data: new Date(data),
        descricao,
        decisao,
      },
    });

    return NextResponse.json(newOccurrence, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar ocorrência:", error);

    // Tratamento de erro de chave estrangeira
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Erro de integridade referencial: aluno, usuário ou tipo inválido." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao criar ocorrência." },
      { status: 500 }
    );
  }
}
