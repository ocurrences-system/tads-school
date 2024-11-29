import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ModalAddOccurrence({ isOpen, onClose, onOccurrenceAdded }) {
  const [formData, setFormData] = useState({
    turmaId: "",
    alunoId: "",
    tipoId: "",
    data: "",
    descricao: "",
  });
  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [tiposOcorrencia, setTiposOcorrencia] = useState([]);

  // Fetch de turmas
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const response = await fetch("/api/turmas");
        if (!response.ok) throw new Error("Erro ao buscar turmas");
        const data = await response.json();
        setTurmas(data);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
        toast.error("Erro ao carregar turmas.");
      }
    };

    fetchTurmas();
  }, []);

  // Fetch de tipos de ocorrência
  useEffect(() => {
    const fetchTiposOcorrencia = async () => {
      try {
        const response = await fetch("/api/tipos-ocorrencia");
        if (!response.ok) throw new Error("Erro ao buscar tipos de ocorrência");
        const data = await response.json();
        setTiposOcorrencia(data);
      } catch (error) {
        console.error("Erro ao buscar tipos de ocorrência:", error);
        toast.error("Erro ao carregar tipos de ocorrência.");
      }
    };

    fetchTiposOcorrencia();
  }, []);

  // Fetch de alunos por turma
  useEffect(() => {
    if (formData.turmaId) {
      const fetchAlunos = async () => {
        try {
          const response = await fetch(`/api/turmas/${formData.turmaId}/students`);
          if (!response.ok) throw new Error("Erro ao buscar alunos");
          const data = await response.json();
          setAlunos(data);
        } catch (error) {
          console.error("Erro ao buscar alunos:", error);
          toast.error("Erro ao carregar alunos.");
        }
      };

      fetchAlunos();
    }
  }, [formData.turmaId]);

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !formData.alunoId ||
      !formData.tipoId ||
      !formData.data ||
      !formData.descricao
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
  
    try {
      const response = await fetch("/api/occurrences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alunoId: formData.alunoId,
          tipoId: formData.tipoId,
          data: formData.data,
          descricao: formData.descricao,
          usuarioId: "1", // ID fixo do usuário de teste
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar ocorrência.");
      }
  
      const newOccurrence = await response.json();
      toast.success("Ocorrência cadastrada com sucesso!");
      onOccurrenceAdded(newOccurrence);
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar ocorrência:", error);
      toast.error(error.message || "Erro ao cadastrar ocorrência.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Ocorrência</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
            </div>

            {/* Selecionar Aluno */}
            <div>
              <Label>Aluno</Label>
              <Select onValueChange={(value) => handleFormChange("alunoId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selecionar Tipo de Ocorrência */}
            <div>
              <Label>Tipo de Ocorrência</Label>
              <Select onValueChange={(value) => handleFormChange("tipoId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo de ocorrência" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(tiposOcorrencia) &&
                    tiposOcorrencia.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome} (Gravidade: {tipo.gravidade})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => handleFormChange("data", e.target.value)}
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <Label>Descrição</Label>
              <Input
                type="text"
                placeholder="Descrição da ocorrência"
                value={formData.descricao}
                onChange={(e) => handleFormChange("descricao", e.target.value)}
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
