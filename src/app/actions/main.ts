import { NextApiRequest, NextApiResponse } from "next";
import { getAllOccurrences, createOccurrence, deleteOccurrence } from "./occurrences"; // Ajuste o caminho conforme necessário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      if (id) {
        // Buscar uma única ocorrência
        const occurrence = await getAllOccurrences();
        const filteredOccurrence = occurrence.find((occ: { id: string | string[]; }) => occ.id === id); // Filtrar pelo ID
        if (!filteredOccurrence) return res.status(404).json({ error: "Ocorrência não encontrada" });
        return res.status(200).json(filteredOccurrence);
      } else {
        // Buscar todas as ocorrências
        const occurrences = await getAllOccurrences();
        return res.status(200).json(occurrences);
      }
    }

    if (req.method === "POST") {
      const { alunoId, usuarioId, data, tipo, descricao, decisao } = req.body;
      const newOccurrence = await createOccurrence({ alunoId, usuarioId, data, tipo, descricao, decisao });
      return res.status(201).json(newOccurrence);
    }

    if (req.method === "DELETE") {
      if (!id) return res.status(400).json({ error: "ID é obrigatório para deletar" });
      await deleteOccurrence(String(id));
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
