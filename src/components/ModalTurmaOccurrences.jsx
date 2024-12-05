"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Camera } from "lucide-react";
import ModalStudentImage from "@/components/ModalStudentImage";
import { toast } from "sonner";

export default function ModalOccurrences({ isOpen, onClose, occurrences }) {
  const [selectedOccurrence, setSelectedOccurrence] = useState(null); // Estado para a ocorrência selecionada
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false); // Controle do modal de descrição
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Controle do modal de imagem
  const [studentImage, setStudentImage] = useState(null); // Imagem do estudante

  const fetchStudentData = async (studentId) => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) throw new Error("Erro ao buscar estudante");
      const data = await response.json();

      // Verifica e converte a imagem para base64, se necessário
      if (data.foto && typeof data.foto === "object" && data.foto.type === "Buffer" && Array.isArray(data.foto.data)) {
        const base64String = `data:image/jpeg;base64,${Buffer.from(data.foto.data).toString("base64")}`;
        data.foto = base64String;
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar dados do estudante:", error);
      toast.error("Erro ao carregar os dados do estudante.");
      throw error;
    }
  };

  const handleOccurrenceClick = (occurrence) => {
    if (isImageModalOpen) return; // Evita abrir o modal de descrição se o modal de imagem estiver ativo
    setSelectedOccurrence(occurrence);
    setIsDescriptionModalOpen(true);
  };

  const handleCameraClick = async (studentId) => {
    try {
      const studentData = await fetchStudentData(studentId);
      if (studentData.foto) {
        setStudentImage(studentData.foto);
        setIsImageModalOpen(true);
      } else {
        toast.error("Este aluno não possui uma foto disponível.");
      }
    } catch {
      toast.error("Erro ao carregar a foto do aluno.");
    }
  };

  return (
    <>
      {/* Modal Principal */}
      <Dialog open={isOpen && !isImageModalOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-screen overflow-hidden">
          <DialogHeader>
            <DialogTitle>Ocorrências da Turma</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {occurrences.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                <table className="table-fixed w-full border-collapse border-spacing-0">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-2 text-left font-bold border-b">Data</th>
                      <th className="px-2 py-2 text-left font-bold border-b">Aluno</th>
                      <th className="px-2 py-2 text-left font-bold border-b">Tipo</th>
                      <th className="px-2 py-2 text-left font-bold border-b">Gravidade</th>
                      <th className="px-2 py-2 text-left font-bold border-b">Descrição</th>
                      <th className="px-2 py-2 text-left font-bold border-b">Decisão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {occurrences.map((occurrence, index) => (
                      <tr
                        key={occurrence.id}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-gray-50" : ""
                        }`}
                        onClick={() => handleOccurrenceClick(occurrence)} // Abre o modal ao clicar
                      >
                        <td className="px-2 py-2 truncate">
                          {new Date(occurrence.data).toLocaleDateString("pt-br")}
                        </td>
                        <td className="px-2 py-2">
                          <div className="flex items-center space-x-2">
                            {occurrence.aluno?.nome ? (
                              <Link
                                href={`/profiles/student?id=${occurrence.aluno.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                {occurrence.aluno.nome}
                              </Link>
                            ) : (
                              "Aluno desconhecido"
                            )}
                            {occurrence.aluno?.id && (
                              <Camera
                                className="cursor-pointer text-gray-500 hover:text-gray-800"
                                size={20}
                                onClick={(e) => {
                                  e.stopPropagation(); // Impede o clique de abrir o modal de descrição
                                  handleCameraClick(occurrence.aluno.id);
                                }}
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 truncate">
                          {occurrence.tipo?.nome || "Não especificado"}
                        </td>
                        <td className="px-2 py-2">
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
                        </td>
                        <td className="px-2 py-2 truncate" title={occurrence.descricao}>
                          {occurrence.descricao}
                        </td>
                        <td className="px-2 py-2 truncate" title={occurrence.decisao}>
                          {occurrence.decisao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma ocorrência encontrada para esta turma.</p>
            )}
            <div className="flex justify-end">
              <Button onClick={onClose}>Fechar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Imagem */}
      <ModalStudentImage
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={studentImage}
      />

      {/* Modal Secundário para Descrição Completa */}
      {selectedOccurrence && (
        <Dialog open={isDescriptionModalOpen && !isImageModalOpen} onOpenChange={setIsDescriptionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Descrição Completa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Data:</strong>{" "}
                {new Date(selectedOccurrence.data).toLocaleDateString("pt-br")}
              </p>
              <p className="flex items-center space-x-2">
                <strong>Aluno:</strong> {selectedOccurrence.aluno?.nome || "Desconhecido"}
                {selectedOccurrence.aluno?.id && (
                  <Camera
                    className="cursor-pointer text-gray-500 hover:text-gray-800"
                    size={20}
                    onClick={() => handleCameraClick(selectedOccurrence.aluno.id)}
                  />
                )}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedOccurrence.tipo?.nome || "Não especificado"}
              </p>
              <p>
                <strong>Descrição:</strong>
              </p>
              <p className="text-gray-700">{selectedOccurrence.descricao}</p>
              <p>
                <strong>Decisão:</strong>
              </p>
              <p className="text-gray-700">{selectedOccurrence.decisao || "Não definida"}</p>
              <div className="flex justify-end">
                <Button onClick={() => setIsDescriptionModalOpen(false)}>Fechar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
