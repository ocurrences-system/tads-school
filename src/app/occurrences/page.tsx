"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function OccurrenceManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [occurrences, setOccurrences] = useState([
    { aluno: "João Silva", data: "2024-06-01", tipo: "Indisciplina", descricao: "Faltou com respeito ao professor." },
  ])
  const [editingIndex, setEditingIndex] = useState<number | null>(null) // Estado para controlar qual ocorrência está sendo editada

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
      formData.decisao = "Sugestão: Conversar com o aluno e notificar os responsáveis."
    } else if (formData.tipo === "Atraso") {
      formData.decisao = "Sugestão: Registrar a ocorrência e solicitar justificativa."
    } else {
      formData.decisao = "Sugestão: Avaliar a situação e tomar medidas apropriadas."
    }

    if (editingIndex !== null) {
      // Editar a ocorrência existente
      setOccurrences((prev) => {
        const updated = [...prev]
        updated[editingIndex] = { ...formData }
        return updated
      })
    } else {
      // Adicionar uma nova ocorrência
      setOccurrences((prev) => [...prev, { ...formData }])
    }

    alert("Ocorrência salva com a sugestão de decisão: " + formData.decisao)


    setFormData({
      aluno: "",
      data: "",
      tipo: "",
      descricao: "",
      decisao: "",
    })
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setEditingIndex(null)
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    const occurrence = occurrences[index]
    setFormData({ ...occurrence }) 
    setIsEditModalOpen(true)
  }

  const handleDelete = (index: number) => {
    setOccurrences((prev) => prev.filter((_, i) => i !== index))
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occurrences.map((occurrence, index) => (
                  <TableRow key={index}>
                    <TableCell>{occurrence.aluno}</TableCell>
                    <TableCell>{occurrence.data}</TableCell>
                    <TableCell>{occurrence.tipo}</TableCell>
                    <TableCell>{occurrence.descricao}</TableCell>
                    <TableCell>
                      <Button variant="info" size="sm" onClick={() => handleEdit(index)}>Editar</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>Excluir</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false)
          setIsEditModalOpen(false)
          setEditingIndex(null) 
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? "Editar Ocorrência" : "Adicionar Ocorrência"}</DialogTitle>
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
              <Button type="submit">{editingIndex !== null ? "Salvar Alterações" : "Salvar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
