import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import archiver from "archiver";
import { Readable } from "stream";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const backupData = {
      users: await prisma.user.findMany(),
      funcoes: await prisma.funcao.findMany(),
      turmas: await prisma.turma.findMany(),
      students: await prisma.student.findMany(),
      occurrences: await prisma.occurrence.findMany(),
      tipos: await prisma.tipo.findMany(),
      tipoCounters: await prisma.tipoCounter.findMany(),
    };

    const backupFileName = `backup-${Date.now()}.json`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    const zipFileName = `backup-${Date.now()}.zip`;
    const zipStream = archiver("zip", { zlib: { level: 9 } });
    
    const response = new NextResponse(zipStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${zipFileName}`,
      },
    });

    zipStream.append(JSON.stringify(backupData, null, 2), { name: backupFileName });

    const uploadFiles = await fs.readdir(uploadsDir);
    for (const file of uploadFiles) {
      const filePath = path.join(uploadsDir, file);
      zipStream.file(filePath, { name: `uploads/${file}` });
    }

    zipStream.finalize();

    return response;
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
