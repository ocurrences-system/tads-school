"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalStudentImageProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
}

const ModalStudentImage: React.FC<ModalStudentImageProps> = ({
  isOpen,
  onClose,
  imageSrc,
}) => {
  if (!isOpen) return null; // Não renderiza nada se o modal estiver fechado

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose(); // Fecha o modal ao clicar fora do conteúdo
        }
      }}
    >
      <div
        className="relative bg-white p-4 rounded-md shadow-lg"
        onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar no conteúdo do modal
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Foto do Aluno"
            className="w-auto max-w-full max-h-[80vh] object-contain"
          />
        ) : (
          <p className="text-center text-gray-500">Nenhuma imagem disponível</p>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Impede o clique no botão de fechar de afetar outros elementos
            onClose(); // Fecha o modal de imagem
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default ModalStudentImage;
