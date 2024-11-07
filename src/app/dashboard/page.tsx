"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Bar, Pie } from "react-chartjs-2"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function Dashboard() {
  const [ocorrencias, setOcorrencias] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    aluno: "",
    data: "",
    tipo: "Indisciplina",
    descricao: "",
    decisao: "",
  })

  // Função para carregar as ocorrências do JSON
  useEffect(() => {
    const fetchOcorrencias = async () => {
      try {
        const response = await fetch("http://localhost:3001/occurrences")
        const data = await response.json()
        setOcorrencias(data)
      } catch (error) {
        console.error("Erro ao carregar as ocorrências:", error)
      }
    }

    fetchOcorrencias()
  }, [])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddOccurrence = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3001/occurrences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`)

      const newOccurrence = await response.json()
      setOcorrencias((prev) => [...prev, newOccurrence])
      toast.success("Ocorrência adicionada com sucesso!")
      setIsAddModalOpen(false)
      setFormData({ aluno: "", data: "", tipo: "Indisciplina", descricao: "", decisao: "" })
    } catch (error) {
      console.error("Erro ao adicionar ocorrência:", error)
      toast.error("Erro ao adicionar ocorrência.")
    }
  }

  const barData = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio"],
    datasets: [
      {
        label: "Ocorrências",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  const pieData = {
    labels: ["Tipo 1", "Tipo 2", "Tipo 3"],
    datasets: [
      {
        label: "Tipos de Ocorrências",
        data: [10, 15, 5],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  }

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
                {ocorrencias.slice(0, 5).map((ocorrencia) => (
                  <li key={ocorrencia.id}>
                    {ocorrencia.aluno} - {ocorrencia.tipo}: {ocorrencia.descricao}
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full"><Link href="/occurrences">Gerenciar Ocorrências</Link></Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Estatísticas</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Bar data={barData} />
                  </div>
                  <div>
                    <Pie data={pieData} />
                  </div>
                </div>
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

      {/* Modal de Adição de Ocorrência */}
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
    </div>
  )
}
