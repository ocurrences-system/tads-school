import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ModalAddTurma({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: "",
    ano: new Date().getFullYear(), // Ano padrão é o ano atual
  });

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.ano) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch("/api/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar turma.");
      }

      const newTurma = await response.json();
      toast.success("Turma criada com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      toast.error(error.message || "Erro ao criar turma.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Turma</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nome da Turma */}
            <div>
              <Label>Nome</Label>
              <Input
                type="text"
                placeholder="Nome da turma"
                value={formData.nome}
                onChange={(e) => handleFormChange("nome", e.target.value)}
                required
              />
            </div>

            {/* Ano da Turma */}
            <div>
              <Label>Ano</Label>
              <Input
                type="number"
                placeholder="Ano da turma"
                value={formData.ano}
                onChange={(e) => handleFormChange("ano", Number(e.target.value))}
                required
              />
            </div>

            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
