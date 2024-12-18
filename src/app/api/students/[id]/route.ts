import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import crypto from "crypto";

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

    let fotoAdulterada = false;

    if (student.fotoPath && student.fotoHash) {
      const relativePath = student.fotoPath.replace(/^\//, '');
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      console.log("Checando existência do arquivo em:", fullPath);
      if (fs.existsSync(fullPath)) {
        const fileBuffer = fs.readFileSync(fullPath);
        const currentHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

        console.log("DB Hash:", student.fotoHash);
        console.log("Current Hash:", currentHash);

        if (currentHash !== student.fotoHash) {
          fotoAdulterada = true;
        }
      } else {
        // Se o arquivo não existe mais, pode considerar como adulterado
        fotoAdulterada = true;
      }
    }
    console.log("Resposta do GET de aluno:", JSON.stringify({ fotoAdulterada }, null, 2));
    return NextResponse.json({ ...student, fotoAdulterada }, { status: 200 });
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
    const emailP = formData.get("emailP") as string;
    const tel = formData.get("tel") as string;
    const telP = formData.get("telP") as string;
    const data_nascimento = formData.get("data_nascimento") as string;
    const newTurmaId = formData.get("turmaId") as string; // Nova turma selecionada
    const file = formData.get("file") as File;

    if (!nome || !email || !data_nascimento) {
      return NextResponse.json(
        { error: "Nome, email e data de nascimento são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca o aluno atual para saber a turma antiga
    const currentStudent = await prisma.student.findUnique({
      where: { id },
      select: { turmaId: true },
    });

    if (!currentStudent) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    let fotoPath: string | undefined;
    let fotoHash: string | undefined;

    if (file) {
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);

      // Calcula o MD5 da foto
      fotoHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

      const fileName = `${id}-${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.]/g,
        "_"
      )}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      await fs.promises.writeFile(filePath, fileBuffer);
      fotoPath = `/uploads/${fileName}`;
    }

    const updatedData: any = {
      nome,
      email,
      emailP,
      tel,
      telP,
      data_nascimento: new Date(data_nascimento),
    };

    // Atualiza a foto e o hash somente se o arquivo foi enviado
    if (fotoPath && fotoHash) {
      updatedData.fotoPath = fotoPath;
      updatedData.fotoHash = fotoHash;
    }

    // Verifica se a turma realmente mudou
    const oldTurmaId = currentStudent.turmaId;
    const turmaMudou = newTurmaId && newTurmaId !== oldTurmaId;

    if (newTurmaId) {
      updatedData.turmaId = newTurmaId;
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updatedData,
    });

    // Se a turma mudou, atualiza o histórico
    if (turmaMudou) {
      // Fecha o histórico anterior definindo o endDate
      const lastHistory = await prisma.studentTurmaHistory.findFirst({
        where: {
          studentId: id,
          endDate: null,
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      if (lastHistory && oldTurmaId) {
        await prisma.studentTurmaHistory.update({
          where: { id: lastHistory.id },
          data: { endDate: new Date() },
        });
      }

      // Cria novo registro no histórico
      await prisma.studentTurmaHistory.create({
        data: {
          studentId: id,
          turmaId: newTurmaId,
          startDate: new Date(),
          endDate: null,
        },
      });
    }

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
    let fotoHash: string | undefined;

    if (file) {
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);

      // Calcula o MD5 da foto
      fotoHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

      const fileName = `${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9.]/g,
        "_"
      )}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      await fs.promises.writeFile(filePath, fileBuffer);
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
        fotoHash, // Armazena o hash da foto no novo aluno
      },
    });

    // Cria o primeiro registro de histórico de turma
    await prisma.studentTurmaHistory.create({
      data: {
        studentId: newStudent.id,
        turmaId: turmaId,
        startDate: new Date(),
        endDate: null,
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
