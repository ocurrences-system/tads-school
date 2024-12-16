import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Certifica-se de que a pasta de uploads existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

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
        turma: true,
        occurrences: {
          include: {
            tipo: true,
          },
        },
        // Incluindo também o tipoCounter
        tipoCounter: {
          include: {
            tipo: true,
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
    const formData = await request.formData();

    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const emailP = formData.get("emailP") as string; // Email dos pais
    const tel = formData.get("tel") as string; // Telefone do aluno
    const telP = formData.get("telP") as string; // Telefone dos pais
    const data_nascimento = formData.get("data_nascimento") as string;
    const file = formData.get("file") as File;

    if (!nome || !email || !data_nascimento) {
      return NextResponse.json(
        { error: "Nome, email e data de nascimento são obrigatórios" },
        { status: 400 }
      );
    }

    let fotoPath: string | undefined;

    if (file) {
      const buffer = await file.arrayBuffer();
      const fileName = `${id}-${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.]/g,
        "_"
      )}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      await fs.promises.writeFile(filePath, Buffer.from(buffer));
      fotoPath = `/uploads/${fileName}`;
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        nome,
        email,
        emailP, // Atualiza o emailP
        tel, // Atualiza telefone
        telP, // Atualiza telefone dos pais
        data_nascimento: new Date(data_nascimento),
        fotoPath,
      },
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error: any) {
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
  } catch (error: any) {
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
    const formData = await request.formData();

    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const emailP = formData.get("emailP") as string;
    const tel = formData.get("tel") as string;
    const telP = formData.get("telP") as string;
    const data_nascimento = formData.get("data_nascimento") as string;
    const turmaId = formData.get("turmaId") as string;
    const file = formData.get("file") as File;

    if (!nome || !email || !data_nascimento || !turmaId) {
      return NextResponse.json(
        { error: "Nome, email, data de nascimento e turma são obrigatórios" },
        { status: 400 }
      );
    }

    let fotoPath: string | undefined;

    if (file) {
      const buffer = await file.arrayBuffer();
      const fileName = `${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.]/g,
        "_"
      )}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      await fs.promises.writeFile(filePath, Buffer.from(buffer));
      fotoPath = `/uploads/${fileName}`;
    }

    const newStudent = await prisma.student.create({
      data: {
        nome,
        email,
        emailP,
        tel,
        telP,
        data_nascimento: new Date(data_nascimento),
        turmaId,
        fotoPath,
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
