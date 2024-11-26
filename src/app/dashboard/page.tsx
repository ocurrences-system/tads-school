"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { toast } from "sonner";
import Link from "next/link";
import ModalAddOccurrence from "@/components/ModalAddOccurrence";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch de ocorrências e turmas no backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ocorrenciasResponse, turmasResponse] = await Promise.all([
          fetch("/api/occurrences"),
          fetch("/api/turmas"),
        ]);

        if (!ocorrenciasResponse.ok || !turmasResponse.ok) {
          throw new Error("Erro ao buscar dados.");
        }

        const ocorrenciasData = await ocorrenciasResponse.json();
        const turmasData = await turmasResponse.json();

        setOcorrencias(ocorrenciasData);
        setTurmas(turmasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Não foi possível carregar os dados.");
      }
    };

    fetchData();
  }, []);

  const filteredOccurrences = useMemo(() => {
    if (selectedTurma) {
      return ocorrencias.filter((o) => o.aluno?.turmaId === selectedTurma);
    }
    return ocorrencias;
  }, [ocorrencias, selectedTurma]);

  const getMonthlyOccurrences = () => {
    const monthlyCounts = Array(12).fill(0);
    filteredOccurrences.forEach((ocorrencia) => {
      const month = new Date(ocorrencia.data).getMonth();
      monthlyCounts[month] += 1;
    });
    return monthlyCounts;
  };

  const handleOccurrenceAdded = (newOccurrence) => {
    setOcorrencias((prev) => [...prev, newOccurrence]);
  };

  const barData = {
    labels: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    datasets: [
      {
        label: "Ocorrências",
        data: getMonthlyOccurrences(),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-start">
              <a className="text-lg font-bold" href="#">
                Sistema de Ocorrências
              </a>
            </div>
            <div className="flex items-center">
              <Button asChild>
                <Link href="/">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Ocorrências Recentes</h3>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {filteredOccurrences.slice(0, 5).map((o) => (
                  <li key={o.id}>
                    <Link href={`/profiles/student?id=${o.aluno?.id}`}>
                      <span className="text-blue-600 hover:underline">
                        {o.aluno?.nome || "Aluno não encontrado"}
                      </span>
                    </Link>{" "}
                    - {o.tipo?.nome || "Tipo desconhecido"}
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full">
                <Link href="/occurrences">Gerenciar Ocorrências</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Estatísticas</h3>
                  <select
                    className="border rounded p-2"
                    value={selectedTurma}
                    onChange={(e) => setSelectedTurma(e.target.value)}
                  >
                    <option value="">Todas as Turmas</option>
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <Bar data={barData} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Acesso Rápido</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button onClick={() => setIsAddModalOpen(true)}>Adicionar Ocorrência</Button>
                  <Button asChild>
                    <Link href="/profiles/student">Gerenciar Alunos</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/db">Gerenciar Dados</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sugestions">Gerenciar Sugestões</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ModalAddOccurrence
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onOccurrenceAdded={handleOccurrenceAdded}
      />
    </div>
  );
}
