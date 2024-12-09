import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";

// Esquema de validação com Zod
const alunoSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório."),
  email: z.string().optional(),
  tel: z.string().optional(),
  telP: z.string().optional(),
  turmaId: z.string().nonempty("A turma é obrigatória."),
  data_nascimento: z.string().nonempty("A data de nascimento é obrigatória."),
});

export default function ModalAddAluno({ isOpen, onClose, turmas }: { isOpen: boolean; onClose: () => void; turmas: any[] }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    tel: "",
    telP: "",
    turmaId: "",
    data_nascimento: "",
  });

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleFormChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida os dados do formulário
    const result = alunoSchema.safeParse(formData);

    if (!result.success) {
      // Atualiza os erros na interface
      setErrors(result.error.issues);
      toast.error("Por favor, corrija os erros no formulário.");
      return;
    }

    // Envia os dados se a validação for bem-sucedida
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar aluno.");
      }

      const newAluno = await response.json();
      toast.success("Aluno criado com sucesso!");
      onClose();
    } catch (error: any) {
      console.error("Erro ao criar aluno:", error);
      toast.error(error.message || "Erro ao criar aluno.");
    }
  };

  const getError = (field: string) => {
    return errors.find((error) => error.path[0] === field)?.message || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Aluno</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nome do Aluno */}
            <div>
              <Label>Nome</Label>
              <Input
                type="text"
                placeholder="Nome do aluno"
                value={formData.nome}
                onChange={(e) => handleFormChange("nome", e.target.value)}
              />
              {getError("nome") && <p className="text-red-500 text-sm">{getError("nome")}</p>}
            </div>

            {/* Email do Aluno */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email do aluno"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
              />
              {getError("email") && <p className="text-red-500 text-sm">{getError("email")}</p>}
            </div>

            {/* Telefone do Aluno */}
            <div>
              <Label>Telefone</Label>
              <Input
                type="text"
                placeholder="Telefone do aluno"
                value={formData.tel}
                onChange={(e) => handleFormChange("tel", e.target.value)}
              />
            </div>

            {/* Telefone dos Pais */}
            <div>
              <Label>Telefone dos Pais</Label>
              <Input
                type="text"
                placeholder="Telefone dos pais"
                value={formData.telP}
                onChange={(e) => handleFormChange("telP", e.target.value)}
              />
            </div>

            {/* Selecionar Turma */}
            <div>
              <Label>Turma</Label>
              <Select onValueChange={(value) => handleFormChange("turmaId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("turmaId") && <p className="text-red-500 text-sm">{getError("turmaId")}</p>}
            </div>

            {/* Data de Nascimento */}
            <div>
              <Label>Data de Nascimento</Label>
              <Input
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => handleFormChange("data_nascimento", e.target.value)}
              />
              {getError("data_nascimento") && (
                <p className="text-red-500 text-sm">{getError("data_nascimento")}</p>
              )}
            </div>

            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
