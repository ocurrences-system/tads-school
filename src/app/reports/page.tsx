"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect } from "react"
import { useState } from "react"
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

export default function Reports() {
  const [filterAluno, setFilterAluno] = useState("")
  const [filterDataInicio, setFilterDataInicio] = useState("")
  const [filterDataFim, setFilterDataFim] = useState("")
  const [filterTipo, setFilterTipo] = useState("")

  const handleSubmit = (e: any) => {
    e.preventDefault()
    alert(`Filtrando relatórios por: Aluno: ${filterAluno}, Data Início: ${filterDataInicio}, Data Fim: ${filterDataFim}, Tipo: ${filterTipo}`)
  }

  const data = {
    labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
    datasets: [
      {
        label: "Número de Ocorrências",
        data: [12, 19, 3, 5, 2, 3],
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
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Relatórios de Ocorrências</h2>
        </div>

    
        <form className="flex space-x-4 mb-6" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Aluno"
            value={filterAluno}
            onChange={(e) => setFilterAluno(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Data Início"
            value={filterDataInicio}
            onChange={(e) => setFilterDataInicio(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Data Fim"
            value={filterDataFim}
            onChange={(e) => setFilterDataFim(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Tipo de Indisciplina"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Filtrar
          </Button>
        </form>

     
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
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>João Silva</TableCell>
                  <TableCell>2024-06-01</TableCell>
                  <TableCell>Indisciplina</TableCell>
                  <TableCell>Faltou com respeito ao professor.</TableCell>
                </TableRow>
              
              </TableBody>
            </Table>
          </CardContent>
        </Card>

   
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Gráfico de Ocorrências</h3>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
