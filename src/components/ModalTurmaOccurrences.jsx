"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Camera } from "lucide-react";
import ModalStudentImage from "@/components/ModalStudentImage";
import ModalOccurrenceDescription from "@/components/ModalOccurrenceDescription";
import { toast } from "sonner";

const ModalOccurrences = ({ isOpen, onClose, occurrences }) => {
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [studentImage, setStudentImage] = useState(null);

  const fetchStudentData = async (studentId) => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      if (!response.ok) throw new Error("Erro ao buscar estudante");
      const data = await response.json();

      // Verifica se o caminho da foto existe
      if (data.fotoPath) {
        const imagePath = `${data.fotoPath}`;
        return imagePath;
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar dados do estudante:", error);
      toast.error("Erro ao carregar os dados do estudante.");
      throw error;
    }
  };

  const handleCameraClick = async (studentId) => {
    try {
      const imagePath = await fetchStudentData(studentId);
      if (imagePath) {
        setStudentImage(imagePath);
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
      {isOpen && (
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
                          onClick={() => setSelectedOccurrence(occurrence)}
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
                                    e.stopPropagation();
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
      )}

      {/* Modal de Imagem */}
      <ModalStudentImage
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageSrc={studentImage}
      />

      {/* Modal Secundário */}
      <ModalOccurrenceDescription
        isOpen={!!selectedOccurrence}
        onClose={() => setSelectedOccurrence(null)}
        occurrence={selectedOccurrence}
        onCameraClick={handleCameraClick}
      />
    </>
  );
};

export default ModalOccurrences;
