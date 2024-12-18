"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ModalEditStudent({
  isOpen,
  onClose,
  student,
  onStudentUpdated,
  refetchStudent,
  setLoadingState,
  turmas = [],
}) {
  const [yearSelected, setYearSelected] = useState("");
  const [filteredTurmas, setFilteredTurmas] = useState([]);

  const [formData, setFormData] = useState({
    nome: student?.nome || "",
    email: student?.email || "",
    emailP: student?.emailP || "",
    tel: student?.tel || "",
    telP: student?.telP || "",
    data_nascimento: student?.data_nascimento?.split("T")[0] || "",
    foto: null,
    turmaId: student?.turmaId || "",
  });

  // Atualiza o form quando o student muda
  useEffect(() => {
    if (student) {
      setFormData({
        nome: student?.nome || "",
        email: student?.email || "",
        emailP: student?.emailP || "",
        tel: student?.tel || "",
        telP: student?.telP || "",
        data_nascimento: student?.data_nascimento?.split("T")[0] || "",
        turmaId: student?.turmaId || "",
        foto: null
      });
    }
  }, [student]);

  // Quando selecionar o ano, filtrar as turmas
  useEffect(() => {
    if (yearSelected) {
      // Filtra turmas pelo ano selecionado
      const turmasFiltradas = turmas.filter((t) => t.ano.toString() === yearSelected.toString());
      setFilteredTurmas(turmasFiltradas);

      // Caso a turma atual do aluno não pertença ao ano selecionado, limpa o turmaId
      if (formData.turmaId) {
        const turmaAtual = turmasFiltradas.find((t) => t.id === formData.turmaId);
        if (!turmaAtual) {
          setFormData((prev) => ({ ...prev, turmaId: "" }));
        }
      }
    } else {
      // Se não tiver ano selecionado, ainda não filtra
      setFilteredTurmas([]);
      setFormData((prev) => ({ ...prev, turmaId: "" }));
    }
  }, [yearSelected, turmas, formData.turmaId]);

  // Se o aluno já tiver uma turma no momento da edição,
  // seleciona automaticamente o ano daquela turma.
  useEffect(() => {
    if (student?.turma?.ano) {
      setYearSelected(student.turma.ano.toString());
    }
  }, [student]);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.email ||
      !formData.emailP ||
      !formData.tel ||
      !formData.telP ||
      !formData.data_nascimento ||
      !formData.turmaId
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoadingState(true);

      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("emailP", formData.emailP);
      formDataToSend.append("tel", formData.tel);
      formDataToSend.append("telP", formData.telP);
      formDataToSend.append("data_nascimento", formData.data_nascimento);
      formDataToSend.append("turmaId", formData.turmaId);
      if (formData.foto) {
        formDataToSend.append("file", formData.foto);
      }

      const response = await fetch(`/api/students/${student.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Erro ao atualizar aluno");

      const updatedStudent = await response.json();
      toast.success("Aluno atualizado com sucesso!");
      onStudentUpdated(updatedStudent);
      onClose();

      setTimeout(() => {
        refetchStudent();
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast.error("Erro ao atualizar aluno.");
    } finally {
      setLoadingState(false);
    }
  };

  // Obter a lista única de anos disponíveis a partir das turmas
  const anos = [...new Set(turmas.map((t) => t.ano))];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Aluno</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <Input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email dos Pais</label>
            <Input
              type="email"
              value={formData.emailP}
              onChange={(e) => handleInputChange("emailP", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <Input
              type="text"
              value={formData.tel}
              onChange={(e) => handleInputChange("tel", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone dos Pais</label>
            <Input
              type="text"
              value={formData.telP}
              onChange={(e) => handleInputChange("telP", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <Input
              type="date"
              value={formData.data_nascimento}
              onChange={(e) => handleInputChange("data_nascimento", e.target.value)}
              required
            />
          </div>

          {/* Seletor de Ano */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Ano</label>
            <Select
              value={yearSelected}
              onValueChange={(value) => {
                setYearSelected(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ano" />
              </SelectTrigger>
              <SelectContent>
                {anos.map((ano) => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seletor de Turma após selecionar o ano */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Turma</label>
            <Select
              value={formData.turmaId}
              onValueChange={(value) => handleInputChange("turmaId", value)}
              disabled={!yearSelected} // Desabilita caso não tenha ano selecionado
            >
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Foto</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
