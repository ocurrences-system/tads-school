"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { UploadCloud, DownloadCloud } from "lucide-react";

export default function DbPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBackup = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/backup", { method: "GET" });
      if (!response.ok) throw new Error("Erro ao fazer backup dos dados.");

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `backup-${new Date().toISOString()}.zip`;
      link.click();

      toast.success("Backup realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer backup:", error);
      toast.error("Erro ao realizar backup.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImport = async (file: File, type: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/import-${type}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Erro ao importar ${type}.`);

      toast.success(`${type} importado com sucesso!`);
    } catch (error) {
      console.error(`Erro ao importar ${type}:`, error);
      toast.error(`Erro ao importar ${type}.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleImport(file, type);
  };

  const handleImportImages = async (directoryHandle) => {
    setIsUploading(true);
    try {
      const formData = new FormData();

      for await (const fileHandle of directoryHandle.values()) {
        const file = await fileHandle.getFile();
        formData.append("files", file, file.name);
      }

      const response = await fetch("/api/import-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao importar as imagens.");

      toast.success("Imagens importadas com sucesso!");
    } catch (error) {
      console.error("Erro ao importar as imagens:", error);
      toast.error("Erro ao importar as imagens.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFolderSelect = async () => {
    try {
      if ("showDirectoryPicker" in window) {
        const directoryHandle = await window.showDirectoryPicker();
        handleImportImages(directoryHandle);
      } else {
        toast.error("Seu navegador não suporta a seleção de diretórios.");
      }
    } catch (error) {
      console.error("Erro ao selecionar pasta:", error);
      toast.error("Erro ao selecionar pasta.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciar Banco de Dados</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-700">Fazer Backup</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Faça o download de um arquivo ZIP contendo o banco de dados atual e os arquivos de uploads.
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

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-700">Importar Dados</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Selecione um arquivo JSON para importar os dados.</p>
              <input
                type="file"
                accept=".json"
                onChange={(e) => handleFileChange(e, "json")}
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

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-700">Importar Imagens</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Selecione uma pasta contendo as imagens para importar.
              </p>
              <Button
                onClick={handleFolderSelect}
                disabled={isUploading}
                aria-busy={isUploading}
                className="flex items-center space-x-2"
              >
                <UploadCloud size={20} />
                {isUploading ? "Importando Imagens..." : "Importar Imagens"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
