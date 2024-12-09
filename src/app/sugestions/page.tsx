"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash2, Settings, Plus } from "lucide-react";

export default function ConfigPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEditUser = (userId) => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success(`Usuário ${userId} editado com sucesso!`);
      setIsProcessing(false);
    }, 1000);
  };

  const handleDeleteUser = (userId) => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success(`Usuário ${userId} deletado com sucesso!`);
      setIsProcessing(false);
    }, 1000);
  };

  const handleGlobalSettings = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Configurações globais atualizadas com sucesso!");
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações do Sistema</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gerenciamento de Usuários */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-700">Gerenciar Usuários</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Edite, remova ou adicione usuários para manter o controle do sistema.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <Input type="text" placeholder="ID do Usuário" className="flex-grow" />
                <Button
                  onClick={() => handleEditUser("123")}
                  disabled={isProcessing}
                  aria-busy={isProcessing}
                  className="flex items-center space-x-2"
                >
                  <Edit size={20} />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDeleteUser("123")}
                  disabled={isProcessing}
                  aria-busy={isProcessing}
                  variant="destructive"
                  className="flex items-center space-x-2"
                >
                  <Trash2 size={20} />
                  Deletar
                </Button>
                <Button
                  onClick={() => toast.success("Novo usuário adicionado!")}
                  disabled={isProcessing}
                  aria-busy={isProcessing}
                  variant="default"
                  className="flex items-center space-x-2 bg-green-500 text-white hover:bg-green-600"
                >
                  <Plus size={20} />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Globais */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-700">Configurações Globais</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ajuste as configurações gerais do sistema para personalizá-lo de acordo com as necessidades da instituição.
              </p>
              <Button
                onClick={handleGlobalSettings}
                disabled={isProcessing}
                aria-busy={isProcessing}
                className="flex items-center space-x-2"
              >
                <Settings size={20} />
                Atualizar Configurações Globais
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
