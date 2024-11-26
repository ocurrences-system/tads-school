"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function PerfilAluno() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alunoIdFromURL = searchParams.get("id");

  const [turmas, setTurmas] = useState([]);
  const [selectedTurma, setSelectedTurma] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(alunoIdFromURL);
  const [studentData, setStudentData] = useState(null);
  const [occurrences, setOccurrences] = useState([]);
  const [isSearching, setIsSearching] = useState(!alunoIdFromURL); // Estado para alternar entre perfil e busca

  // Fetch turmas no carregamento inicial
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const response = await fetch(`/api/turmas`);
        if (!response.ok) throw new Error("Erro ao buscar turmas");
        const data = await response.json();
        setTurmas(data);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
        toast.error("Erro ao carregar as turmas.");
      }
    };

    fetchTurmas();
  }, []);

  // Buscar alunos por turma
  useEffect(() => {
    if (selectedTurma) {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`/api/turmas/${selectedTurma}/students`);
          if (!response.ok) throw new Error("Erro ao buscar alunos");
          const data = await response.json();
          setStudents(data);
        } catch (error) {
          console.error("Erro ao carregar alunos:", error);
          toast.error("Erro ao carregar os alunos.");
        }
      };

      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedTurma]);

  // Buscar estudante e ocorrências associadas
  useEffect(() => {
    if (selectedStudentId) {
      const fetchStudentData = async () => {
        try {
          const response = await fetch(`/api/students/${selectedStudentId}`);
          if (!response.ok) throw new Error("Erro ao buscar estudante");
          const data = await response.json();
          setStudentData(data);

          // Buscar ocorrências do estudante
          const occurrencesResponse = await fetch(`/api/students/${selectedStudentId}/occurrences`);
          if (!occurrencesResponse.ok) throw new Error("Erro ao buscar ocorrências");
          const occurrencesData = await occurrencesResponse.json();
          setOccurrences(occurrencesData);
        } catch (error) {
          console.error("Erro ao carregar dados do estudante:", error);
          toast.error("Erro ao carregar os dados do estudante.");
        }
      };

      fetchStudentData();
    }
  }, [selectedStudentId]);

  const handleStudentSelection = (studentId) => {
    setSelectedStudentId(studentId);
    setIsSearching(false);
    router.push(`/profiles/student?id=${studentId}`);
  };

  const handleSearchAgain = () => {
    setIsSearching(true);
    setSelectedTurma("");
    setStudents([]);
    setStudentData(null);
    router.push(`/profiles/student`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-800">Perfil do Aluno</span>
          <div className="flex space-x-4">
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-8">
        {isSearching || !studentData ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Buscar Aluno</h2>

            {/* Seleção de Turma */}
            <div className="mb-4">
              <label htmlFor="turma" className="block text-sm font-medium text-gray-700">
                Selecione uma Turma
              </label>
              <select
                id="turma"
                className="w-full border rounded p-2 mt-1"
                value={selectedTurma}
                onChange={(e) => setSelectedTurma(e.target.value)}
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Seleção de Aluno */}
            {students.length > 0 && (
              <div className="mb-4">
                <label htmlFor="aluno" className="block text-sm font-medium text-gray-700">
                  Selecione um Aluno
                </label>
                <select
                  id="aluno"
                  className="w-full border rounded p-2 mt-1"
                  value={selectedStudentId || ""}
                  onChange={(e) => handleStudentSelection(e.target.value)}
                >
                  <option value="">Selecione um aluno</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Detalhes do Aluno</h2>
              <Button onClick={handleSearchAgain} className="mt-4">
                Buscar Outro Aluno
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Dados Pessoais</h3>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    <strong>Nome:</strong> {studentData.nome}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {studentData.email}
                  </p>
                  <p className="mb-2">
                    <strong>Data de Nascimento:</strong>{" "}
                    {new Date(studentData.data_nascimento).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    <strong>Turma:</strong> {studentData.turma?.nome || "Não atribuída"}
                  </p>
                </CardContent>
              </Card>

              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Ocorrências</h3>
                  </CardHeader>
                  <CardContent>
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="text-left py-3 px-4 text-gray-600">Data</th>
                          <th className="text-left py-3 px-4 text-gray-600">Tipo</th>
                          <th className="text-left py-3 px-4 text-gray-600">Descrição</th>
                          <th className="text-left py-3 px-4 text-gray-600">Gravidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {occurrences.map((occurrence) => (
                          <tr
                            key={occurrence.id}
                            className={`border-t border-gray-200 ${
                              occurrence.tipo?.gravidade >= 3
                                ? "bg-red-200"
                                : occurrence.tipo?.gravidade === 2
                                ? "bg-yellow-100"
                                : "bg-green-100"
                            }`}
                          >
                            <td className="py-3 px-4">{new Date(occurrence.data).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{occurrence.tipo?.nome || "Desconhecido"}</td>
                            <td className="py-3 px-4">{occurrence.descricao}</td>
                            <td className="py-3 px-4">{occurrence.tipo?.gravidade || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
