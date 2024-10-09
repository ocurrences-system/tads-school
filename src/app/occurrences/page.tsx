"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function OccurrenceManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    aluno: "",
    data: "",
    tipo: "",
    descricao: "",
    decisao: "",
  })

  const handleFormChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (formData.tipo === "Indisciplina") {
      setFormData((prev) => ({
        ...prev,
        decisao: "Sugestão: Conversar com o aluno e notificar os responsáveis.",
      }))
    } else if (formData.tipo === "Atraso") {
      setFormData((prev) => ({
        ...prev,
        decisao: "Sugestão: Registrar a ocorrência e solicitar justificativa.",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        decisao: "Sugestão: Avaliar a situação e tomar medidas apropriadas.",
      }))
    }
    alert("Ocorrência salva com a sugestão de decisão: " + formData.decisao)
    // Aqui, enviar os dados para o backend
    setIsAddModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <a href="#" className="text-lg font-bold">
              Sistema de Ocorrências
            </a>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" href="/dashboard">
                Dashboard
              </Button>
              <Button>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gerenciamento de Ocorrências</h2>
          <Button onClick={() => setIsAddModalOpen(true)}>Adicionar Ocorrência</Button>
        </div>

        {/* Filtros */}
        <form className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Aluno"
            name="filterAluno"
            className="w-full sm:w-auto"
          />
          <Input
            type="date"
            name="filterData"
            className="w-full sm:w-auto"
          />
          <Input
            placeholder="Tipo de Indisciplina"
            name="filterTipo"
            className="w-full sm:w-auto"
          />
          <Button variant="secondary">Filtrar</Button>
        </form>

        {/* Tabela de Ocorrências */}
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>João Silva</TableCell>
                  <TableCell>2024-06-01</TableCell>
                  <TableCell>Indisciplina</TableCell>
                  <TableCell>Faltou com respeito ao professor.</TableCell>
                  <TableCell>
                    <Button variant="info" size="sm" onClick={() => setIsEditModalOpen(true)}>Editar</Button>
                    <Button variant="destructive" size="sm">Excluir</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal Adicionar Ocorrência */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Ocorrência</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aluno">Aluno</Label>
                <Input
                  id="aluno"
                  placeholder="Nome do Aluno"
                  name="aluno"
                  onChange={handleFormChange}
                  value={formData.aluno}
                />
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  type="date"
                  id="data"
                  name="data"
                  onChange={handleFormChange}
                  value={formData.data}
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Input
                  id="tipo"
                  placeholder="Tipo de Indisciplina"
                  name="tipo"
                  onChange={handleFormChange}
                  value={formData.tipo}
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição"
                  name="descricao"
                  onChange={handleFormChange}
                  value={formData.descricao}
                />
              </div>
              <div>
                <Label htmlFor="decisao">Sugestão de Tomada de Decisão</Label>
                <Textarea
                  id="decisao"
                  placeholder="Sugestão de Tomada de Decisão"
                  name="decisao"
                  value={formData.decisao}
                  disabled
                />
              </div>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Ocorrência */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ocorrência</DialogTitle>
          </DialogHeader>
          {/* Formulário similar ao de adicionar */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
