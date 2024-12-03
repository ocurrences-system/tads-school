import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ModalOccurrences({ isOpen, onClose, occurrences }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-screen overflow-hidden">
        <DialogHeader>
          <DialogTitle>Ocorrências da Turma</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {occurrences.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <table className="table-fixed w-full border-collapse border-spacing-0">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 py-2 text-left font-bold border-b">Data</th>
                    <th className="px-2 py-2 text-left font-bold border-b">Aluno</th>
                    <th className="px-2 py-2 text-left font-bold border-b">Tipo</th>
                    <th className="px-2 py-2 text-left font-bold border-b">Gravidade</th>
                    <th className="px-2 py-2 text-left font-bold border-b">Descrição</th>
                    <th className="px-2 py-2 text-left font-bold border-b">Decisão</th>
                  </tr>
                </thead>
                <tbody>
                  {occurrences.map((occurrence, index) => (
                    <tr
                      key={occurrence.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-2 py-2 truncate">
                        {new Date(occurrence.data).toLocaleDateString("pt-br")}
                      </td>
                      <td className="px-2 py-2">
                        {occurrence.aluno?.nome ? (
                          <Link
                            href={`/profiles/student?id=${occurrence.aluno.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {occurrence.aluno.nome}
                          </Link>
                        ) : (
                          "Aluno desconhecido"
                        )}
                      </td>
                      <td className="px-2 py-2 truncate">
                        {occurrence.tipo?.nome || "Não especificado"}
                      </td>
                      <td className="px-2 py-2">
                        <Badge
                          variant={
                            occurrence.tipo?.gravidade === 3
                              ? "destructive"
                              : occurrence.tipo?.gravidade === 2
                              ? "warning"
                              : "default"
                          }
                        >
                          {occurrence.tipo?.gravidade || "N/A"}
                        </Badge>
                      </td>
                      <td className="px-2 py-2 truncate" title={occurrence.descricao}>
                        {occurrence.descricao}
                      </td>
                      <td className="px-2 py-2 truncate" title={occurrence.decisao}>
                        {occurrence.decisao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma ocorrência encontrada para esta turma.</p>
          )}
          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
