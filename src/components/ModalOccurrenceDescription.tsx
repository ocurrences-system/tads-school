"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function ModalOccurrenceDescription({
  isOpen,
  onClose,
  occurrence,
  onCameraClick, // Recebe a função handleCameraClick
}) {
  if (!occurrence) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Descrição Completa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Data:</strong>{" "}
            {new Date(occurrence.data).toLocaleDateString("pt-br")}
          </p>
          <p>
            <strong>Registrado por:</strong> {occurrence.usuario?.nome || "Desconhecido"}
          </p>
          <p className="flex items-center space-x-2">
            <strong>Aluno:</strong> {occurrence.aluno?.nome || "Desconhecido"}
            {occurrence.aluno?.id && (
              <Camera
                className="cursor-pointer text-gray-500 hover:text-gray-800"
                size={20}
                onClick={(e) => {
                  e.stopPropagation(); // Evita fechar o modal ao clicar na câmera
                  onCameraClick(occurrence.aluno.id); // Chama a função passada como prop
                }}
              />
            )}
          </p>
          <p>
            <strong>Tipo:</strong> {occurrence.tipo?.nome || "Não especificado"}
          </p>
          <p>
            <strong>Descrição:</strong>
          </p>
          <p className="text-gray-700">{occurrence.descricao}</p>
          <p>
            <strong>Decisão:</strong>
          </p>
          <p className="text-gray-700">{occurrence.decisao || "Não definida"}</p>
          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
