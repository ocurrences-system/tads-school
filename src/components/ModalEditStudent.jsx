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
  turmas, // Turmas passadas como prop
}) {
  const [formData, setFormData] = useState({
    nome: student?.nome || "",
    email: student?.email || "",
    emailP: student?.emailP || "", // Campo email dos pais
    tel: student?.tel || "", // Campo telefone
    telP: student?.telP || "", // Campo telefone dos pais
    data_nascimento: student?.data_nascimento?.split("T")[0] || "", // Formato yyyy-mm-dd
    foto: null, // Foto do aluno
    turmaId: student?.turmaId || "", // ID da turma
  });

  useEffect(() => {
    if (student) {
      setFormData((prevData) => ({
        ...prevData,
        nome: student?.nome || "",
        email: student?.email || "",
        emailP: student?.emailP || "", // Atualiza o emailP
        tel: student?.tel || "", // Atualiza o telefone
        telP: student?.telP || "", // Atualiza o telefone dos pais
        data_nascimento: student?.data_nascimento?.split("T")[0] || "",
        turmaId: student?.turmaId || "", // Atualiza turmaId
      }));
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

      // Cria um FormData para enviar o arquivo e os dados
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("emailP", formData.emailP); // Envia email dos pais
      formDataToSend.append("tel", formData.tel); // Envia telefone
      formDataToSend.append("telP", formData.telP); // Envia telefone dos pais
      formDataToSend.append("data_nascimento", formData.data_nascimento);
      formDataToSend.append("turmaId", formData.turmaId); // Enviando o ID da turma
      if (formData.foto) {
        formDataToSend.append("file", formData.foto); // Se houver foto, envia também
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

      // Aguarda meio segundo e busca os dados novamente
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Turma</label>
            <Select
              value={formData.turmaId} // Passa o turmaId correto aqui
              onValueChange={(value) => handleInputChange("turmaId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas?.map((turma) => (
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
