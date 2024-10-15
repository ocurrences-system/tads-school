"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function OccurrenceTypes() {
  const [tipoOcorrencia, setTipoOcorrencia] = useState("")
  const [gravidade, setGravidade] = useState("Baixa")

  const [editTipoOcorrencia, setEditTipoOcorrencia] = useState("")
  const [editGravidade, setEditGravidade] = useState("Baixa")

  const data = {
    labels: ["Indisciplina", "Atraso", "Desrespeito", "Falta"],
    datasets: [
      {
        label: "Número de Ocorrências",
        data: [12, 19, 3, 5],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const handleAddSubmit = (e: any) => {
    e.preventDefault()
    alert(`Tipo de Ocorrência: ${tipoOcorrencia}, Gravidade: ${gravidade}`)
  }

  const handleEditSubmit = (e: any) => {
    e.preventDefault()
    alert(`Editando: ${editTipoOcorrencia}, Gravidade: ${editGravidade}`)
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Configuração dos Tipos de Ocorrências</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Adicionar Tipo de Ocorrência</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Tipo de Ocorrência</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Ocorrência
                  </label>
                  <Input
                    type="text"
                    placeholder="Nome do Tipo de Ocorrência"
                    value={tipoOcorrencia}
                    onChange={(e) => setTipoOcorrencia(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Gravidade
                  </label>
                  <Select value={gravidade} onValueChange={setGravidade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a gravidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Salvar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

      
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Tipos de Ocorrências</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Ocorrência</TableHead>
                  <TableHead>Parâmetros</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Indisciplina</TableCell>
                  <TableCell>Gravidade: Alta</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="info" size="sm">
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Tipo de Ocorrência</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Tipo de Ocorrência
                            </label>
                            <Input
                              type="text"
                              placeholder="Nome do Tipo de Ocorrência"
                              value={editTipoOcorrencia}
                              onChange={(e) => setEditTipoOcorrencia(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Gravidade
                            </label>
                            <Select value={editGravidade} onValueChange={setEditGravidade}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a gravidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Baixa">Baixa</SelectItem>
                                <SelectItem value="Média">Média</SelectItem>
                                <SelectItem value="Alta">Alta</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit">Salvar</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm">
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
