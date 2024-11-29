import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Retorna os dados de um aluno específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { 
        turma: true, // Inclui dados da turma atual
        occurrences: {
          include: {
            tipo: true, // Inclui detalhes do tipo da ocorrência
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error(`Erro ao buscar aluno ${id}:`, error);
    return NextResponse.json(
      { error: "Erro ao buscar aluno" },
      { status: 500 }
    );
  }
}

// PUT - Atualiza os dados de um aluno específico
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();

    const { nome, email, data_nascimento, foto } = body;
    if (!nome || !email || !data_nascimento) {
      return NextResponse.json(
        { error: "Nome, email e data de nascimento são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        nome,
        email,
        data_nascimento: new Date(data_nascimento),
        foto: foto ? Buffer.from(foto, "base64") : undefined, // Salva como Blob
      },
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error(`Erro ao atualizar aluno ${id}:`, error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar aluno" },
      { status: 500 }
    );
  }
}

// DELETE - Remove um aluno específico
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Aluno removido com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Erro ao deletar aluno ${id}:`, error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao deletar aluno" },
      { status: 500 }
    );
  }
}

// POST - Cria um novo aluno
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nome, email, data_nascimento, turmaId, foto } = body;
    if (!nome || !email || !data_nascimento || !turmaId) {
      return NextResponse.json(
        { error: "Nome, email, data de nascimento e turma são obrigatórios" },
        { status: 400 }
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        nome,
        email,
        data_nascimento: new Date(data_nascimento),
        turmaId,
        foto: foto ? Buffer.from(foto, "base64") : undefined, // Salva como Blob
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    return NextResponse.json(
      { error: "Erro ao criar aluno" },
      { status: 500 }
    );
  }
}
