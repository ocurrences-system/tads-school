"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ModalEditStudent({
    isOpen,
    onClose,
    student,
    onStudentUpdated,
    refetchStudent,
    setLoadingState,
}) {
    const [formData, setFormData] = useState({
        nome: student?.nome || "",
        email: student?.email || "",
        data_nascimento: student?.data_nascimento?.split("T")[0] || "",
        foto: null, // Armazena o arquivo selecionado
    });

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

        try {
            setLoadingState(true);

            // Cria um FormData para enviar o arquivo e os dados
            const formDataToSend = new FormData();
            formDataToSend.append("nome", formData.nome);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("data_nascimento", formData.data_nascimento);
            if (formData.foto) {
                formDataToSend.append("file", formData.foto); // O arquivo será processado no backend
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
                        <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                        <Input
                            type="date"
                            value={formData.data_nascimento}
                            onChange={(e) => handleInputChange("data_nascimento", e.target.value)}
                            required
                        />
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
