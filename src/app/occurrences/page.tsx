"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface Occurrence {
  id: number;
  aluno: string;
  data: string;
  tipo: string;
  descricao: string;
  decisao: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OccurrenceManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [formData, setFormData] = useState({
    aluno: "",
    data: "",
    tipo: "Indisciplina",
    descricao: "",
    decisao: "",
  });
  const [editOccurrenceId, setEditOccurrenceId] = useState<number | null>(null);

  useEffect(() => {
    fetchOccurrences();
  }, []);

  const fetchOccurrences = async () => {
    try {
      console.log("Fetching occurrences from API...");
      const response = await fetch(`${API_URL}/occurrences`);
      if (!response.ok) throw new Error("Erro ao buscar ocorrências");
      const data = await response.json();
      setOccurrences(data);
      console.log("Occurrences fetched successfully:", data);
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
      toast.error("Erro ao buscar ocorrências.");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOccurrence = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Attempting to add occurrence:", formData);
    try {
      const response = await fetch(`${API_URL}/occurrences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);

      const newOccurrence = await response.json();
      setOccurrences((prevOccurrences) => [...prevOccurrences, newOccurrence]);
      toast.success("Ocorrência adicionada com sucesso!");
      setIsAddModalOpen(false);
      setFormData({ aluno: "", data: "", tipo: "Indisciplina", descricao: "", decisao: "" });
      console.log("Occurrence added successfully:", newOccurrence);
    } catch (error) {
      console.error("Erro ao adicionar ocorrência:", error);
      toast.error("Erro ao adicionar ocorrência.");
    }
  };

  const handleEditOccurrence = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editOccurrenceId === null) return;

    console.log("Attempting to edit occurrence:", { ...formData, id: editOccurrenceId });
    try {
      const response = await fetch(`${API_URL}/occurrences/${editOccurrenceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id: editOccurrenceId }),
      });

      if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);

      const updatedOccurrence = await response.json();
      setOccurrences((prevOccurrences) =>
        prevOccurrences.map((occurrence) => (occurrence.id === editOccurrenceId ? updatedOccurrence : occurrence))
      );
      toast.success("Ocorrência editada com sucesso!");
      setIsEditModalOpen(false);
      setFormData({ aluno: "", data: "", tipo: "Indisciplina", descricao: "", decisao: "" });
      setEditOccurrenceId(null);
      console.log("Occurrence edited successfully:", updatedOccurrence);
    } catch (error) {
      console.error("Erro ao editar ocorrência:", error);
      toast.error("Erro ao editar ocorrência.");
    }
  };

  const handleDeleteOccurrence = async (occurrenceId: number) => {
    if (confirm("Você tem certeza que deseja excluir esta ocorrência?")) {
      try {
        console.log("Attempting to delete occurrence:", occurrenceId);
        const response = await fetch(`${API_URL}/occurrences/${occurrenceId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);

        setOccurrences((prevOccurrences) => prevOccurrences.filter((occurrence) => occurrence.id !== occurrenceId));
        toast.success("Ocorrência excluída com sucesso!");
        console.log("Occurrence deleted successfully:", occurrenceId);
      } catch (error) {
        console.error("Erro ao excluir ocorrência:", error);
        toast.error("Erro ao excluir ocorrência.");
      }
    }
  };

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gerenciamento de Ocorrências</h2>
          <Button onClick={() => setIsAddModalOpen(true)}>Adicionar Ocorrência</Button>
        </div>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Ocorrências</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Decisão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occurrences.map((occurrence) => (
                  <TableRow key={occurrence.id}>
                    <TableCell>{occurrence.aluno}</TableCell>
                    <TableCell>{occurrence.data}</TableCell>
                    <TableCell>{occurrence.tipo}</TableCell>
                    <TableCell>{occurrence.descricao}</TableCell>
                    <TableCell>{occurrence.decisao}</TableCell>
                    <TableCell>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            aluno: occurrence.aluno,
                            data: occurrence.data,
                            tipo: occurrence.tipo,
                            descricao: occurrence.descricao,
                            decisao: occurrence.decisao,
                          });
                          setEditOccurrenceId(occurrence.id);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteOccurrence(occurrence.id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

   
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Ocorrência</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddOccurrence}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aluno">Aluno</Label>
                <Input
                  id="aluno"
                  placeholder="Nome do Aluno"
                  name="aluno"
                  onChange={handleFormChange}
                  value={formData.aluno}
                  required
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  name="data"
                  onChange={handleFormChange}
                  value={formData.data}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Input
                  id="tipo"
                  name="tipo"
                  onChange={handleFormChange}
                  value={formData.tipo}
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  placeholder="Descrição da Ocorrência"
                  name="descricao"
                  onChange={handleFormChange}
                  value={formData.descricao}
                  required
                />
              </div>
              <div>
                <Label htmlFor="decisao">Decisão</Label>
                <Input
                  id="decisao"
                  placeholder="Decisão tomada"
                  name="decisao"
                  onChange={handleFormChange}
                  value={formData.decisao}
                  required
                />
              </div>
              <Button type="submit">Adicionar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

     
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ocorrência</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditOccurrence}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aluno">Aluno</Label>
                <Input
                  id="aluno"
                  placeholder="Nome do Aluno"
                  name="aluno"
                  onChange={handleFormChange}
                  value={formData.aluno}
                  required
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  name="data"
                  onChange={handleFormChange}
                  value={formData.data}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Input
                  id="tipo"
                  name="tipo"
                  onChange={handleFormChange}
                  value={formData.tipo}
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  placeholder="Descrição da Ocorrência"
                  name="descricao"
                  onChange={handleFormChange}
                  value={formData.descricao}
                  required
                />
              </div>
              <div>
                <Label htmlFor="decisao">Decisão</Label>
                <Input
                  id="decisao"
                  placeholder="Decisão tomada"
                  name="decisao"
                  onChange={handleFormChange}
                  value={formData.decisao}
                  required
                />
              </div>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
