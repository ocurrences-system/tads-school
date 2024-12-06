import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Extrair dados de todas as tabelas
    const backupData = {
      users: await prisma.user.findMany(),
      funcoes: await prisma.funcao.findMany(),
      turmas: await prisma.turma.findMany(),
      students: await prisma.student.findMany(),
      occurrences: await prisma.occurrence.findMany(),
      tipos: await prisma.tipo.findMany(),
      tipoCounters: await prisma.tipoCounter.findMany(),
    };

    const backupFilePath = `./backup-${Date.now()}.json`;

    // Salva os dados em um arquivo JSON
    await fs.writeFile(backupFilePath, JSON.stringify(backupData, null, 2), {
      encoding: "utf8",
    });

    return NextResponse.json({
      message: "Backup gerado com sucesso!",
      filePath: backupFilePath,
    });
  } catch (error) {
    console.error("Erro ao gerar backup:", error.message);
    return NextResponse.json(
      { error: "Erro ao criar backup. Tente novamente mais tarde." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
