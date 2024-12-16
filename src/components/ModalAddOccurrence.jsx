import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ModalAddTurma from "./ModalAddTurma";
import ModalAddAluno from "./ModalAddAluno";
import ModalAddTipoOcorrencia from "./ModalAddTipoOcorrencia";

export default function ModalAddOccurrence({ isOpen, onClose, onOccurrenceAdded }) {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toISOString().split("T")[0]; // Data no formato YYYY-MM-DD
  const [formData, setFormData] = useState({
    turmaId: "",
    alunoId: "",
    tipoId: "",
    data: currentDate, // Data padrão
    descricao: "",
  });
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [turmas, setTurmas] = useState([]);
  const [filteredTurmas, setFilteredTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [tiposOcorrencia, setTiposOcorrencia] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

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

  // Filtrar turmas pelo ano selecionado
  useEffect(() => {
    setFilteredTurmas(turmas.filter((turma) => turma.ano === selectedYear));
  }, [selectedYear, turmas]);

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
      //toast.success("Ocorrência cadastrada com sucesso!");
      onOccurrenceAdded(newOccurrence);
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar ocorrência:", error);
      toast.error(error.message || "Erro ao cadastrar ocorrência.");
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Ocorrência</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Selecionar Ano */}
            <div>
              <Label>Ano</Label>
              <Select
                defaultValue={currentYear.toString()} // Define o texto padrão como o ano atual
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={currentYear.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(turmas.map((turma) => turma.ano))].map((ano) => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selecionar Turma */}
            <div>
              <Label>Turma</Label>
              <div className="flex items-center space-x-2">
                <Select onValueChange={(value) => handleFormChange("turmaId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTurmas.map((turma) => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={() => openModal("turma")}>+</Button>
              </div>
            </div>

            {/* Selecionar Aluno */}
            <div>
              <Label>Aluno</Label>
              <div className="flex items-center space-x-2">
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
                <Button type="button" onClick={() => openModal("aluno")}>+</Button>
              </div>
            </div>

            {/* Selecionar Tipo de Ocorrência */}
            <div>
              <Label>Tipo de Ocorrência</Label>
              <div className="flex items-center space-x-2">
                <Select onValueChange={(value) => handleFormChange("tipoId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de ocorrência" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposOcorrencia.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nome} (Gravidade: {tipo.gravidade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={() => openModal("tipo")}>+</Button>
              </div>
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

      {/* Modais */}
      <ModalAddTurma isOpen={isModalOpen && modalType === "turma"} onClose={() => setIsModalOpen(false)} />
      <ModalAddAluno isOpen={isModalOpen && modalType === "aluno"} onClose={() => setIsModalOpen(false)} turmas={turmas} />
      <ModalAddTipoOcorrencia isOpen={isModalOpen && modalType === "tipo"} onClose={() => setIsModalOpen(false)} onTipoAdded={() => { }} />    
      </Dialog>
  );
}
