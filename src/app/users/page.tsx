"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Ajuste de caminho se necessário
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // Ajuste de caminho se necessário
import { Label } from "@/components/ui/label"; // Ajuste de caminho se necessário
import { Input } from "@/components/ui/input"; // Ajuste de caminho se necessário
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Ajuste de caminho se necessário
import { toast } from "sonner"; // Ajuste de caminho se necessário

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PerfilAluno() {
  const [studentData, setStudentData] = useState<any>(null); // Novo estado para os dados do aluno
  const [occurrences, setOccurrences] = useState<any[]>([]);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  const fetchOccurrences = async () => {
    try {
      const response = await fetch(`${API_URL}/occurrences`);
      if (!response.ok) throw new Error("Erro ao buscar ocorrências");
      const data = await response.json();
      setOccurrences(data);
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
      toast.error("Erro ao buscar ocorrências.");
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`${API_URL}/users`); // Ajuste a URL conforme necessário
      if (!response.ok) throw new Error("Erro ao buscar dados do aluno");
      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error("Erro ao buscar dados do aluno:", error);
      toast.error("Erro ao buscar dados do aluno.");
    }
  };

  useEffect(() => {
    fetchOccurrences();
    fetchStudentData();

    // (Código do gráfico se necessário)
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-800">
            Sistema de Ocorrências
          </span>
          <div className="flex space-x-4">
            <a className="text-lg text-blue-500 hover:text-blue-700" href="#">
              Dashboard
            </a>
            <a className="text-lg text-blue-500 hover:text-blue-700" href="#">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-4">Perfil do Aluno</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Dados Pessoais
            </h3>
            {studentData ? (
              <>
                <p className="mb-2">
                  <strong>Nome:</strong> {studentData.nome}
                </p>
                <p className="mb-2">
                  <strong>Data de Nascimento:</strong> {studentData.dataNascimento}
                </p>
                <p className="mb-2">
                  <strong>Turma:</strong> {studentData.turma}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {studentData.email}
                </p>
              </>
            ) : (
              <p className="mb-2">Carregando dados do aluno...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
