"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PerfilAluno() {
  const [studentData, setStudentData] = useState<any>(null);
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
      const response = await fetch(`${API_URL}/users`);
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

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <a href="#" className="text-lg font-bold">
              Sistema de Ocorrências
            </a>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/">Logout</Link>
              </Button>
            </div>
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
