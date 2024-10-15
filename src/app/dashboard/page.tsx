"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Bar, Pie } from "react-chartjs-2"
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
                <li>Ocorrência 1</li>
                <li>Ocorrência 2</li>
                <li>Ocorrência 3</li>
              </ul>
              <Button className="mt-4 w-full">Gerenciar Ocorrências</Button>
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

          {/* Acesso Rápido */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Acesso Rápido</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button asChild>
  <Link href="/occurrences">Adicionar Ocorrência</Link>
</Button>
                  <Button variant="secondary" className="w-full">
                    Gerenciar Usuários
                  </Button>
                  <Button variant="warning" className="w-full">
                    Backup de Dados
                  </Button>
                  <Button className="w-full">Gerenciar Sugestões</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
