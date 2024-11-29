"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

export default function ModalEditStudent({ isOpen, onClose, student, onStudentUpdated }) {
    const [formData, setFormData] = useState({
        nome: student?.nome || "",
        email: student?.email || "",
        data_nascimento: student?.data_nascimento?.split("T")[0] || "",
        foto: student?.foto || null,
    });

    const handleInputChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const options = {
                    maxSizeMB: 0.5, // Tamanho máximo em MB
                    maxWidthOrHeight: 800, // Largura ou altura máxima em pixels
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);
                const base64Image = await convertToBase64(compressedFile);
                setFormData((prev) => ({ ...prev, foto: base64Image.split(",")[1] })); // Remove o prefixo 'data:image/jpeg;base64,'
            } catch (error) {
                console.error("Erro ao comprimir a imagem:", error);
                toast.error("Erro ao comprimir a imagem.");
            }
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/students/${student.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    data_nascimento: formData.data_nascimento,
                    foto: formData.foto, // Envia a imagem comprimida em Base64
                }),
            });

            if (!response.ok) throw new Error("Erro ao atualizar aluno");

            const updatedStudent = await response.json();
            toast.success("Aluno atualizado com sucesso!");
            onStudentUpdated(updatedStudent);
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar aluno:", error);
            toast.error("Erro ao atualizar aluno.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Aluno</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campos de entrada */}
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
                    {/* Upload da imagem */}
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
