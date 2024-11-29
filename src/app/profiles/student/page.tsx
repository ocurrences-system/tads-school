"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import ModalEditStudent from "@/components/ModalEditStudent";

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
  const [filteredOccurrences, setFilteredOccurrences] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(!alunoIdFromURL);
  const [pastClasses, setPastClasses] = useState([]); // Histórico de turmas passadas
  const [selectedOccurrence, setSelectedOccurrence] = useState(null); // Ocorrência selecionada

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Controle do modal de imagem
  const [isOccurrenceModalOpen, setIsOccurrenceModalOpen] = useState(false); // Controle do modal de ocorrência

  const [filterSeverity, setFilterSeverity] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showResolved, setShowResolved] = useState(false);

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc"; // Inverte a ordem
    setSortOrder(newSortOrder);

    const sortedOccurrences = [...filteredOccurrences].sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA; // Ordena baseado na data
    });

    setFilteredOccurrences(sortedOccurrences);
  };

  const handleSaveOccurrence = async (occurrenceId, updatedData) => {
    try {
      const response = await fetch(`/api/occurrences/${occurrenceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData), // Envia todos os campos
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar a ocorrência");
      }

      const updatedOccurrence = await response.json();

      // Atualiza o estado local com a nova ocorrência
      setOccurrences((prevOccurrences) =>
        prevOccurrences.map((occ) =>
          occ.id === updatedOccurrence.id ? updatedOccurrence : occ
        )
      );

      setFilteredOccurrences((prevFiltered) =>
        prevFiltered.map((occ) =>
          occ.id === updatedOccurrence.id ? updatedOccurrence : occ
        )
      );

      toast.success("Ocorrência atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a ocorrência:", error);
      toast.error("Erro ao atualizar a ocorrência.");
    }
  };

  const handleDeleteOccurrence = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta ocorrência?")) {
      try {
        const response = await fetch(`/api/occurrences/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir a ocorrência.");
        }

        setOccurrences((prev) => prev.filter((occ) => occ.id !== id));
        setFilteredOccurrences((prev) => prev.filter((occ) => occ.id !== id));
        toast.success("Ocorrência excluída com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir a ocorrência.");
      }
    }
  };

  const handleResolvedToggle = () => {
    const filtered = occurrences.filter((o) => o.resolvida === showResolved);
    setFilteredOccurrences(filtered);
    setShowResolved(!showResolved);
  };

  const handleStudentUpdated = (updatedStudent) => {
    setStudentData(updatedStudent);
  };

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

  useEffect(() => {
    if (selectedStudentId) {
      const fetchStudentData = async () => {
        try {
          const response = await fetch(`/api/students/${selectedStudentId}`);
          if (!response.ok) throw new Error("Erro ao buscar estudante");
          const data = await response.json();
          if (data.foto && data.foto.type === "Buffer" && Array.isArray(data.foto.data)) {
            const base64String = `data:image/jpeg;base64,${Buffer.from(data.foto.data).toString("base64")}`;
            data.foto = base64String;
          }
          setStudentData(data);

          const occurrencesResponse = await fetch(`/api/students/${selectedStudentId}/occurrences`);
          if (!occurrencesResponse.ok) throw new Error("Erro ao buscar ocorrências");
          const occurrencesData = await occurrencesResponse.json();
          setOccurrences(occurrencesData);
          setFilteredOccurrences(occurrencesData);

          const pastClassesResponse = await fetch(`/api/students/${selectedStudentId}/past-classes`);
          if (!pastClassesResponse.ok) throw new Error("Erro ao buscar histórico de turmas");
          const pastClassesData = await pastClassesResponse.json();
          setPastClasses(pastClassesData);
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

  const handleOccurrenceClick = (occurrence) => {
    setSelectedOccurrence(occurrence);
    setIsOccurrenceModalOpen(true);
  };


  const handleFilterChange = (e) => {
    const severity = e.target.value;
    setFilterSeverity(severity);
    if (severity) {
      setFilteredOccurrences(occurrences.filter((o) => o.tipo?.gravidade === parseInt(severity)));
    } else {
      setFilteredOccurrences(occurrences);
    }
  };

  const handleOccurrenceDecision = (decision) => {
    toast.success(`Decisão "${decision}" aplicada à ocorrência: ${selectedOccurrence.descricao}`);
    setIsOccurrenceModalOpen(false);
  };

  const openModal = (description: string) => {
    setSelectedDescription(description);
    setIsModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto mt-8">
        {isSearching || !studentData ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Buscar Aluno</h2>

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
                    {turma.nome} - {turma.ano}
                  </option>
                ))}
              </select>
            </div>

            {students.length > 0 ? (
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
            ) : (
              <p className="text-gray-600">Nenhum aluno encontrado para esta turma.</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Detalhes do Aluno</h2>
              <Button onClick={handleSearchAgain} className="mt-4">
                Buscar Outro Aluno
              </Button>
              <Button onClick={() => setIsEditModalOpen(true)} className="mt-4 ml-2">
                Editar Aluno
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Dados Pessoais</h3>
                </CardHeader>
                <CardContent>
                  {studentData.foto ? (
                    <img
                      src={studentData.foto}
                      alt="Foto do Aluno"
                      className="w-32 h-40 object-cover border rounded-md mb-4 cursor-pointer"
                      loading="lazy"
                      onClick={() => setIsImageModalOpen(true)} // Abre o modal ao clicar
                    />
                  ) : (
                    <p className="text-gray-600 mb-4">Foto não disponível.</p>
                  )}
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
                    <strong>Turma Atual:</strong> {studentData.turma?.nome} - {studentData.turma?.ano || "Não atribuída"}
                  </p>
                  {pastClasses.length > 0 && (
                    <div className="mt-4">
                      <strong>Turmas Passadas:</strong>
                      <ul className="list-disc pl-5">
                        {pastClasses.map((turma) => (
                          <li key={turma.id}>
                            <Link href={`/turmas/${turma.id}`}>
                              <span className="text-blue-600 hover:underline">
                                {turma.nome} - {turma.ano}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Ocorrências</h3>
                    <div className="mb-4">
                      <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                        Filtrar por Gravidade
                      </label>
                      <select
                        id="filter"
                        className="w-full border rounded p-2 mt-1"
                        value={filterSeverity}
                        onChange={handleFilterChange}
                      >
                        <option value="">Todas</option>
                        <option value="1">Baixa</option>
                        <option value="2">Média</option>
                        <option value="3">Alta</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                        Buscar por Texto
                      </label>
                      <input
                        id="search"
                        type="text"
                        className="w-full border rounded p-2 mt-1"
                        placeholder="Descrição ou Decisão"
                        value={searchText}
                        onChange={(e) => {
                          const text = e.target.value.toLowerCase();
                          setSearchText(text);
                          const filtered = occurrences.filter(
                            (o) =>
                              o.descricao?.toLowerCase().includes(text) ||
                              o.decisao?.toLowerCase().includes(text)
                          );
                          setFilteredOccurrences(text ? filtered : occurrences);
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="resolved" className="block text-sm font-medium text-gray-700">
                        Resolvidas
                      </label>
                      <input
                        type="checkbox"
                        id="resolved"
                        className="ml-2"
                        checked={showResolved}
                        onChange={handleResolvedToggle}
                      />
                    </div>
                    <Button onClick={toggleSortOrder}>
                      Ordenar por Data ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="text-left py-3 px-4 text-gray-600">Data</th>
                          <th className="text-left py-3 px-4 text-gray-600">Tipo</th>
                          <th className="text-left py-3 px-4 text-gray-600">Descrição</th>
                          <th className="text-left py-3 px-4 text-gray-600">Gravidade</th>
                          <th className="text-left py-3 px-4 text-gray-600">Resolvida</th>
                          <th className="text-left py-3 px-4 text-gray-600">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOccurrences.map((occurrence) => (
                          <tr
                            key={occurrence.id}
                            className={`border-t border-gray-200 ${occurrence.tipo?.gravidade >= 3
                                ? "bg-red-200"
                                : occurrence.tipo?.gravidade === 2
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                              }`}
                          >
                            <td className="py-3 px-4">
                              {new Date(occurrence.data).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">{occurrence.tipo?.nome || "Desconhecido"}</td>
                            <td
                              className="px-2 py-2 truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                              onClick={() => openModal(occurrence.descricao)} // Abre o modal para descrição
                            >
                              {occurrence.descricao}
                            </td>
                            <td className="py-3 px-4">{occurrence.tipo?.gravidade || "N/A"}</td>
                            <td className="py-3 px-4">{occurrence.resolvida ? "Sim" : "Não"}</td>
                            <td className="py-3 px-4 flex space-x-4">
                              {/* Ícone de editar */}
                              <button
                                onClick={() => handleOccurrenceClick(occurrence)}
                                className="text-blue-500 hover:text-blue-700"
                                aria-label="Editar ocorrência"
                              >
                                <Pencil size={20} />
                              </button>
                              {/* Ícone de excluir */}
                              <button
                                onClick={() => handleDeleteOccurrence(occurrence.id)} // Função para excluir ocorrência
                                className="text-red-500 hover:text-red-700"
                                aria-label="Excluir ocorrência"
                              >
                                <Trash size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </CardContent>
                </Card>
                <ModalEditStudent
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  student={studentData}
                  onStudentUpdated={handleStudentUpdated}
                />
              </div>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                  <h2 className="text-lg font-bold mb-4">Descrição Completa</h2>
                  <p className="text-gray-700">{selectedDescription}</p>
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setIsModalOpen(false)} variant="outline">
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isImageModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={() => setIsImageModalOpen(false)} // Fecha o modal ao clicar fora
              >
                <div
                  className="bg-white p-4 rounded-md shadow-lg"
                  onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar na imagem
                >
                  <img
                    src={studentData.foto}
                    alt="Foto Ampliada do Aluno"
                    className="w-auto max-w-full max-h-[80vh] object-contain"
                  />
                </div>
              </div>
            )}

            {isOccurrenceModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={() => setIsOccurrenceModalOpen(false)} // Fecha o modal ao clicar fora
              >
                <div
                  className="bg-white p-6 rounded-md shadow-lg max-w-md w-full"
                  onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar no conteúdo
                >
                  <h2 className="text-xl font-semibold mb-4">Tratar Ocorrência</h2>
                  <p><strong>Data:</strong> {new Date(selectedOccurrence.data).toLocaleDateString()}</p>
                  <p><strong>Tipo:</strong> {selectedOccurrence.tipo?.nome || "Não especificado"}</p>

                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Atualizar Descrição
                  </label>
                  <textarea
                    className="w-full border rounded p-2 mt-2"
                    placeholder="Atualize a descrição da ocorrência"
                    value={selectedOccurrence.descricao || ""}
                    onChange={(e) =>
                      setSelectedOccurrence((prev) => ({
                        ...prev,
                        descricao: e.target.value, // Atualiza a descrição no estado local
                      }))
                    }
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Escreva a Decisão
                  </label>
                  <textarea
                    className="w-full border rounded p-2 mt-2"
                    placeholder="Escreva a decisão"
                    value={selectedOccurrence.decisao || ""}
                    onChange={(e) =>
                      setSelectedOccurrence((prev) => ({
                        ...prev,
                        decisao: e.target.value, // Atualiza a decisão no estado local
                      }))
                    }
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Resolvida
                  </label>
                  <input
                    type="checkbox"
                    className="mt-2"
                    checked={selectedOccurrence.resolvida || false} // Mostra o estado atual de resolvida
                    onChange={(e) =>
                      setSelectedOccurrence((prev) => ({
                        ...prev,
                        resolvida: e.target.checked, // Atualiza o estado de resolvida
                      }))
                    }
                  />

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button
                      onClick={() => {
                        const { id, descricao, decisao, resolvida } = selectedOccurrence;
                        handleSaveOccurrence(id, { descricao, decisao, resolvida }); // Envia todos os dados para salvar
                        setIsOccurrenceModalOpen(false);
                      }}
                      className="bg-green-500"
                    >
                      Salvar
                    </Button>

                    <Button onClick={() => setIsOccurrenceModalOpen(false)} className="bg-red-500">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}
