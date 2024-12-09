import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = `./temp-${Date.now()}.json`;
    await fs.writeFile(tempFilePath, fileBuffer);

    const data = JSON.parse(await fs.readFile(tempFilePath, "utf8"));

    await prisma.$transaction(async (tx) => {
      if (data.funcoes) {
        for (const funcao of data.funcoes) {
          await tx.funcao.upsert({
            where: { id: funcao.id },
            update: funcao,
            create: funcao,
          });
        }
      }

      if (data.tipos) {
        for (const tipo of data.tipos) {
          await tx.tipo.upsert({
            where: { id: tipo.id },
            update: tipo,
            create: tipo,
          });
        }
      }

      if (data.users) {
        for (const user of data.users) {
          const funcaoExistente = await tx.funcao.findUnique({
            where: { id: user.funcaoId },
          });

          if (!funcaoExistente) {
            throw new Error(`Função com ID ${user.funcaoId} não existe.`);
          }

          await tx.user.upsert({
            where: { id: user.id },
            update: user,
            create: user,
          });
        }
      }

      if (data.turmas) {
        for (const turma of data.turmas) {
          await tx.turma.upsert({
            where: { id: turma.id },
            update: turma,
            create: turma,
          });
        }
      }

      if (data.students) {
        for (const student of data.students) {
          const turmaExistente = await tx.turma.findUnique({
            where: { id: student.turmaId },
          });

          if (!turmaExistente) {
            throw new Error(`Turma com ID ${student.turmaId} não existe.`);
          }

          await tx.student.upsert({
            where: { id: student.id },
            update: student,
            create: student,
          });
        }
      }

      if (data.occurrences) {
        for (const occurrence of data.occurrences) {
          const alunoExistente = await tx.student.findUnique({
            where: { id: occurrence.alunoId },
          });

          const usuarioExistente = await tx.user.findUnique({
            where: { id: occurrence.usuarioId },
          });

          if (!alunoExistente) {
            throw new Error(`Aluno com ID ${occurrence.alunoId} não existe.`);
          }

          if (!usuarioExistente) {
            throw new Error(`Usuário com ID ${occurrence.usuarioId} não existe.`);
          }

          const tipoExistente = await tx.tipo.findUnique({
            where: { id: occurrence.tipoId },
          });

          if (!tipoExistente) {
            throw new Error(`Tipo com ID ${occurrence.tipoId} não existe.`);
          }

          await tx.occurrence.upsert({
            where: { id: occurrence.id },
            update: occurrence,
            create: occurrence,
          });
        }
      }

      if (data.tipoCounters) {
        for (const counter of data.tipoCounters) {
          const alunoExistente = await tx.student.findUnique({
            where: { id: counter.alunoId },
          });

          const tipoExistente = await tx.tipo.findUnique({
            where: { id: counter.tipoId },
          });

          if (!alunoExistente) {
            throw new Error(`Aluno com ID ${counter.alunoId} não existe.`);
          }

          if (!tipoExistente) {
            throw new Error(`Tipo com ID ${counter.tipoId} não existe.`);
          }

          await tx.tipoCounter.upsert({
            where: { id: counter.id },
            update: counter,
            create: counter,
          });
        }
      }
    });

    return NextResponse.json({
      message: "Restauração realizada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao restaurar banco de dados:", error.message);
    return NextResponse.json(
      { error: "Erro ao restaurar banco de dados." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
