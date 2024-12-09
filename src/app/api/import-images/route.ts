import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (files.length === 0) {
      return NextResponse.json({ error: "Nenhuma imagem foi enviada." }, { status: 400 });
    }

    for (const file of files) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, file.name);

      await fs.writeFile(filePath, fileBuffer);
    }

    return NextResponse.json({ message: "Imagens importadas com sucesso!" });
  } catch (error) {
    console.error("Erro ao importar imagens:", error.message);
    return NextResponse.json({ error: "Erro ao importar as imagens." }, { status: 500 });
  }
}
