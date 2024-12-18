"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash, Camera, Loader, Eye, Mail, Phone, User, Smartphone } from "lucide-react";
import Link from "next/link";
import ModalEditStudent from "@/components/ModalEditStudent";
import ModalStudentImage from "@/components/ModalStudentImage";
import ModalOccurrenceDescription from "@/components/ModalOccurrenceDescription";

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
  const [selectedOccurrence, setSelectedOccurrence] = useState(null);
  const [selectedOccurrenceDesc, setSelectedOccurrenceDesc] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isOccurrenceModalOpen, setIsOccurrenceModalOpen] = useState(false);

  const [filterSeverity, setFilterSeverity] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showResolved, setShowResolved] = useState(true);
  const [showUnresolved, setShowUnresolved] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  // Estado para armazenar tipos que atingiram ou ultrapassaram o limite (ex: 3)
  const [alertTypes, setAlertTypes] = useState([]);

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedOccurrences = [...filteredOccurrences].sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredOccurrences(sortedOccurrences);
  };

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/students/${selectedStudentId}`);
      if (!response.ok) throw new Error("Erro ao buscar estudante");

      const data = await response.json();

      if (data.fotoPath) {
        data.foto = `${data.fotoPath}`;
      }

      setStudentData(data);

      const occurrencesResponse = await fetch(
        `/api/students/${selectedStudentId}/occurrences`
      );
      if (!occurrencesResponse.ok)
        throw new Error("Erro ao buscar ocorrências");

      const occurrencesData = await occurrencesResponse.json();
      setOccurrences(occurrencesData);
      setFilteredOccurrences(occurrencesData);
    } catch (error) {
      console.error("Erro ao carregar dados do estudante:", error);
      toast.error("Erro ao carregar os dados do estudante.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOccurrences = async () => {
    try {
      const response = await fetch(`/api/students/${alunoIdFromURL}/occurrences`);
      if (!response.ok) throw new Error("Erro ao buscar ocorrências");
      const data = await response.json();
      setOccurrences(data);
      setFilteredOccurrences(data);
    } catch (error) {
      console.error("Erro ao carregar ocorrências:", error);
      toast.error("Erro ao carregar as ocorrências.");
    }
  };

  const handleSaveOccurrence = async (occurrenceId, updatedData) => {
    try {
      const response = await fetch(`/api/occurrences/${occurrenceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar a ocorrência");
      }

      const updatedOccurrence = await response.json();

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
      fetchStudentData();
    }
  }, [selectedStudentId]);

  useEffect(() => {
    fetchOccurrences();
  }, [alunoIdFromURL]);

  // Filtra ocorrências baseado nos filtros selecionados
  useEffect(() => {
    const filtered = occurrences.filter((o) => {
      const matchesSeverity = filterSeverity
        ? o.tipo?.gravidade === parseInt(filterSeverity)
        : true;

      const matchesText =
        o.descricao?.toLowerCase().includes(searchText.toLowerCase()) ||
        o.decisao?.toLowerCase().includes(searchText.toLowerCase());

      const matchesResolved = showResolved && o.resolvida;
      const matchesUnresolved = showUnresolved && !o.resolvida;

      return matchesSeverity && matchesText && (matchesResolved || matchesUnresolved);
    });

    setFilteredOccurrences(filtered);
  }, [occurrences, filterSeverity, searchText, showResolved, showUnresolved]);

  // Conta quantas ocorrências por tipo e gera alertas se >= 3
  useEffect(() => {
    if (occurrences.length > 0) {
      const occurrenceCountByType = occurrences.reduce((acc, curr) => {
        if (!curr.tipoId) return acc;
        acc[curr.tipoId] = (acc[curr.tipoId] || 0) + 1;
        return acc;
      }, {});

      const alerts = Object.entries(occurrenceCountByType)
        .filter(([_, count]) => count >= 3)
        .map(([tipoId, count]) => {
          const tipoName = occurrences.find((o) => o.tipoId === tipoId)?.tipo?.nome || "Tipo Desconhecido";
          return { tipoId, tipoName, count };
        });

      setAlertTypes(alerts);
    } else {
      setAlertTypes([]);
    }
  }, [occurrences]);

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-700">Dados Pessoais</h3>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader className="animate-spin w-10 h-10 text-gray-500" />
                    </div>
                  ) : studentData ? (
                    <div>
                      {studentData.foto ? (
                        <img
                          src={studentData.foto}
                          alt="Foto do Aluno"
                          className="w-32 h-40 object-cover border rounded-md mb-4 cursor-pointer"
                          loading="lazy"
                          onClick={() => setIsImageModalOpen(true)}
                        />
                      ) : (
                        <p className="text-gray-500 text-sm italic mb-6">
                          Este aluno não possui uma foto cadastrada.
                        </p>
                      )}

                      {studentData.foto && studentData.fotoAdulterada && (
                        <p className="text-red-500 text-sm italic mb-6">
                          Atenção: A foto atual do aluno não corresponde ao registro original (adulterada).
                        </p>
                      )}

                      <p className="mb-2">
                        <strong>Nome:</strong> {studentData.nome || "Não disponível"}
                      </p>
                      <div className="mt-2">
                        <Card className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="space-y-2">
                            <p className="flex items-center text-gray-600">
                              <Mail className="mr-2 text-blue-500" size={18} />
                              <strong className="mr-2">Email:</strong> {studentData.email || "Não disponível"}
                            </p>
                            <p className="flex items-center text-gray-600">
                              <Phone className="mr-2 text-green-500" size={18} />
                              <strong className="mr-2">Telefone:</strong> {studentData.tel || "Não disponível"}
                            </p>
                            <p className="flex items-center text-gray-600">
                              <User className="mr-2 text-orange-500" size={18} />
                              <strong className="mr-2">Email dos Responsaveis:</strong> {studentData.emailP || "Não disponível"}
                            </p>
                            <p className="flex items-center text-gray-600">
                              <Smartphone className="mr-2 text-purple-500" size={18} />
                              <strong className="mr-2">Telefone dos Responsaveis:</strong> {studentData.telP || "Não disponível"}
                            </p>
                          </div>
                        </Card>
                      </div>
                      <p className="mb-2">
                        <strong>Data de Nascimento:</strong>{" "}
                        {studentData.data_nascimento
                          ? new Date(studentData.data_nascimento).toLocaleDateString("pt-br")
                          : "Não disponível"}
                      </p>
                      <p className="mb-2">
                        <strong>Turma Atual:</strong>{" "}
                        {studentData.turma?.nome
                          ? `${studentData.turma.nome} - ${studentData.turma.ano}`
                          : "Não atribuída"}
                      </p>

                      {/* DEBUG TipoCounter
                      {studentData?.tipoCounter && studentData.tipoCounter.length > 0 && (
                        <div className="mt-4 bg-gray-100 border border-gray-300 p-4 rounded">
                          <h4 className="font-bold mb-2 text-gray-700">Debug: Todos os TipoCounter</h4>
                          <ul className="list-disc pl-5">
                            {studentData.tipoCounter.map((item) => (
                              <li key={item.id} className="text-gray-800">
                                Tipo: <strong>{item.tipo?.nome || "Desconhecido"}</strong> - Count: <strong>{item.count}</strong>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}*/}

                      {alertTypes.length > 0 && (
                        <div className="mt-4 bg-red-100 border border-red-300 p-4 rounded">
                          <h4 className="font-bold mb-2 text-red-700">Atenção!</h4>
                          {alertTypes.map((alert) => (
                            <p key={alert.tipoId} className="text-red-700">
                              O aluno atingiu {alert.count} ocorrências do tipo: <strong>{alert.tipoName}</strong>.
                            </p>
                          ))}
                        </div>
                      )}

                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhum aluno encontrado.</p>
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
                    <div className="mb-4">
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
                    <div className="flex items-center space-x-4">
                      <div>
                        <input
                          type="checkbox"
                          id="resolved"
                          className="mr-2"
                          checked={showResolved}
                          onChange={() => setShowResolved((prev) => !prev)}
                        />
                        <label htmlFor="resolved" className="text-sm">Resolvidas</label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id="unresolved"
                          className="mr-2"
                          checked={showUnresolved}
                          onChange={() => setShowUnresolved((prev) => !prev)}
                        />
                        <label htmlFor="unresolved" className="text-sm">Não Resolvidas</label>
                      </div>
                    </div>
                    <Button onClick={toggleSortOrder}>
                      Ordenar por Data ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {filteredOccurrences.length === 0 ? (
                      <p className="text-center text-gray-500 mt-4">
                        Nenhuma ocorrência encontrada com os filtros aplicados.
                      </p>
                    ) : (
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
                                {new Date(occurrence.data).toLocaleDateString("pt-br")}
                              </td>
                              <td className="py-3 px-4">{occurrence.tipo?.nome || "Desconhecido"}</td>
                              <td className="px-2 py-2 truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {occurrence.descricao}
                              </td>
                              <td className="py-3 px-4">{occurrence.tipo?.gravidade || "N/A"}</td>
                              <td className="py-3 px-4">{occurrence.resolvida ? "Sim" : "Não"}</td>
                              <td className="py-3 px-4 flex space-x-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOccurrenceDesc(occurrence);
                                  }}
                                  className="text-green-500 hover:text-green-700"
                                  aria-label="Ver por completo"
                                >
                                  <Eye size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    handleOccurrenceClick(occurrence);
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                  aria-label="Editar ocorrência"
                                >
                                  <Pencil size={20} />
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteOccurrence(occurrence.id);
                                  }}
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
                    )}
                  </CardContent>
                </Card>
                <ModalEditStudent
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  student={studentData}
                  onStudentUpdated={handleStudentUpdated}
                  refetchStudent={fetchStudentData}
                  setLoadingState={setIsLoading}
                  turmas={turmas}
                />
                {selectedOccurrenceDesc && (
                  <ModalOccurrenceDescription
                    isOpen={!!selectedOccurrenceDesc}
                    onClose={() => setSelectedOccurrenceDesc(null)}
                    occurrence={selectedOccurrenceDesc}
                  />
                )}
              </div>

            </div>

            <ModalStudentImage
              isOpen={isImageModalOpen}
              onClose={() => setIsImageModalOpen(false)}
              imageSrc={studentData?.foto || null}
            />

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

            {isOccurrenceModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={() => setIsOccurrenceModalOpen(false)}
              >
                <div
                  className="bg-white p-6 rounded-md shadow-lg max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-semibold mb-4">Tratar Ocorrência</h2>
                  <p><strong>Data:</strong> {new Date(selectedOccurrence.data).toLocaleDateString("pt-br")}</p>
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
                        descricao: e.target.value,
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
                        decisao: e.target.value,
                      }))
                    }
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-4">
                    Resolvida
                  </label>
                  <input
                    type="checkbox"
                    className="mt-2"
                    checked={selectedOccurrence.resolvida || false}
                    onChange={(e) =>
                      setSelectedOccurrence((prev) => ({
                        ...prev,
                        resolvida: e.target.checked,
                      }))
                    }
                  />

                  <div className="flex justify-end space-x-4 mt-6">
                    <Button
                      onClick={() => {
                        const { id, descricao, decisao, resolvida } = selectedOccurrence;
                        handleSaveOccurrence(id, { descricao, decisao, resolvida });
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
