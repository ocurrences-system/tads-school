import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ModalAddTipo({ isOpen, onClose, onTipoAdded }) {
  const [formData, setFormData] = useState({
    nome: "",
    gravidade: "",
  });

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.gravidade) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await fetch("/api/tipos-ocorrencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar tipo de ocorrência.");
      }

      const newTipo = await response.json();
      toast.success("Tipo de ocorrência criado com sucesso!");
      onTipoAdded(newTipo);
      onClose();
    } catch (error) {
      console.error("Erro ao criar tipo de ocorrência:", error);
      toast.error(error.message || "Erro ao criar tipo de ocorrência.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Tipo de Ocorrência</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nome do Tipo de Ocorrência */}
            <div>
              <Label>Nome</Label>
              <Input
                type="text"
                placeholder="Nome do tipo de ocorrência"
                value={formData.nome}
                onChange={(e) => handleFormChange("nome", e.target.value)}
                required
              />
            </div>

            {/* Gravidade */}
            <div>
              <Label>Gravidade</Label>
              <Input
                type="number"
                min="1"
                max="3"
                placeholder="Gravidade"
                value={formData.gravidade}
                onChange={(e) => handleFormChange("gravidade", e.target.value)}
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
