"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { toast } from "sonner";
import Link from "next/link";
import ModalAddOccurrence from "@/components/ModalAddOccurrence";
import ModalTurmaOccurrences from "@/components/ModalTurmaOccurrences";
import { formatDate } from "@/utils/formatDate";
import { useSession } from "next-auth/react";
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
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [selectedTurmaOccurrences, setSelectedTurmaOccurrences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  // Fetch de ocorrências e turmas no backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredOccurrences = useMemo(() => {
    if (selectedTurma) {
      return ocorrencias.filter((o) => o.aluno?.turma?.id === selectedTurma);
    }
    return ocorrencias;
  }, [ocorrencias, selectedTurma]);

  const getTurmaOccurrences = () => {
    const turmaCounts = {};
    ocorrencias.forEach((ocorrencia) => {
      const turmaName = ocorrencia.aluno?.turma
        ? `${ocorrencia.aluno.turma.nome} (${ocorrencia.aluno.turma.ano})`
        : "Turma Desconhecida";
      turmaCounts[turmaName] = (turmaCounts[turmaName] || 0) + 1;
    });
    return {
      labels: Object.keys(turmaCounts),
      datasets: [
        {
          label: "Ocorrências por Turma",
          data: Object.values(turmaCounts),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const handleBarClick = (event, elements) => {
    if (elements.length === 0) return;

    const index = elements[0].index;
    const turma = getTurmaOccurrences().labels[index];
    const turmaOccurrences = ocorrencias.filter(
      (o) =>
        `${o.aluno?.turma?.nome} (${o.aluno?.turma?.ano})` === turma
    );

    setSelectedTurmaOccurrences(turmaOccurrences);
    setIsTurmaModalOpen(true);
  };

  const handleOccurrenceAdded = (newOccurrence) => {
    setOcorrencias((prev) => [...prev, newOccurrence]);
    toast.success("Ocorrência adicionada com sucesso!");
  };

  const handleCloseTurmaModal = () => {
    setSelectedTurmaOccurrences([]);
    setIsTurmaModalOpen(false);
  };

  if (isLoading) {
    return <p className="text-center mt-10">Carregando dados...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Ocorrências em Aberto</h3>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {filteredOccurrences.length > 0 ? (
                  filteredOccurrences
                    .filter((o) => o.resolvida === false) // Filtra apenas as ocorrências não resolvidas
                    .slice(0, 5)
                    .map((o) => (
                      <li key={o.id}>
                        <Link href={`/profiles/student?id=${o.aluno?.id}`}>
                          <span className="text-blue-600 hover:underline">
                            {o.aluno?.nome || "Aluno não encontrado"}
                          </span>
                        </Link>{" "}
                        - {o.tipo?.nome || "Tipo desconhecido"}
                      </li>
                    ))
                ) : (
                  <p className="text-gray-500">Nenhuma ocorrência encontrada.</p>
                )}
              </ul>
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
                        {turma.nome} ({turma.ano})
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <Bar
                  data={getTurmaOccurrences()}
                  options={{
                    onClick: handleBarClick,
                  }}
                />
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
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    Adicionar Ocorrência
                  </Button>
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

      {isTurmaModalOpen && (
        <ModalTurmaOccurrences
          isOpen={isTurmaModalOpen}
          onClose={handleCloseTurmaModal}
          occurrences={selectedTurmaOccurrences}
        />
      )}
    </div>
  );
}
