"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { UploadCloud, DownloadCloud } from "lucide-react";

export default function GerenciarDados() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Função para fazer backup
  const handleBackup = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/backup", { method: "GET" });
      if (!response.ok) throw new Error("Erro ao fazer backup dos dados.");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup-${new Date().toISOString()}.json`;
      link.click();

      toast.success("Backup realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer backup:", error);
      toast.error("Erro ao realizar backup.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Função para importar dados
  const handleImport = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao importar os dados.");

      toast.success("Dados importados com sucesso!");
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      toast.error("Erro ao importar os dados.");
    } finally {
      setIsUploading(false);
    }
  };

  // Lida com seleção de arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/json") {
      toast.error("Por favor, selecione um arquivo JSON válido.");
      return;
    }
    handleImport(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciar Banco de Dados</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card de Backup */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-700">Fazer Backup</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Faça o download de um arquivo JSON contendo um backup completo dos dados do banco de dados.
              </p>
              <Button
                onClick={handleBackup}
                disabled={isDownloading}
                aria-busy={isDownloading}
                className="flex items-center space-x-2"
              >
                <DownloadCloud size={20} />
                {isDownloading ? "Realizando Backup..." : "Fazer Backup"}
              </Button>
            </CardContent>
          </Card>

          {/* Card de Importação */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-700">Importar Dados</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Selecione um arquivo JSON para importar os dados para o banco de dados.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="mb-4 block"
                disabled={isUploading}
                aria-disabled={isUploading}
              />
              <Button
                disabled={isUploading}
                aria-busy={isUploading}
                className="flex items-center space-x-2"
              >
                <UploadCloud size={20} />
                {isUploading ? "Importando Dados..." : "Importar Dados"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
