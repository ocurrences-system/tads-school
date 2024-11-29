import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ModalOccurrences({ isOpen, onClose, occurrences }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ocorrências da Turma</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {occurrences.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Gravidade</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Decisão</TableCell>
                  <TableCell>Aluno</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occurrences.map((occurrence) => (
                  <TableRow key={occurrence.id}>
                    <TableCell>{new Date(occurrence.data).toLocaleDateString()}</TableCell>
                    <TableCell>{occurrence.tipo?.nome || "Não especificado"}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{occurrence.descricao}</TableCell>
                    <TableCell>{occurrence.decisao}</TableCell>
                    <TableCell>{occurrence.aluno?.nome || "Aluno desconhecido"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
