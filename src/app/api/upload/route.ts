import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const studentId = formData.get("studentId") as string;

  if (!file || !studentId) {
    return NextResponse.json(
      { error: "Arquivo e ID do estudante são obrigatórios." },
      { status: 400 }
    );
  }

  // Gera um nome seguro para o arquivo
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const fileName = `${studentId}-${Date.now()}-${sanitizedFileName}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  try {
    // Verifica se o diretório de uploads existe, caso contrário, cria-o
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    await prisma.student.update({
      where: { id: studentId },
      data: { fotoPath: `/uploads/${fileName}` },
    });

    return NextResponse.json(
      { message: "Upload concluído com sucesso.", filePath: `/uploads/${fileName}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao salvar o arquivo:", error);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json(
      { error: "Erro ao salvar o arquivo." },
      { status: 500 }
    );
  }
}
