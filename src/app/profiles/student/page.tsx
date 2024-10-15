"use client";

import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

export default function PerfilAluno() {
  const [selectedOccurrence, setSelectedOccurrence] = useState<any>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null); 

  const handleViewOccurrence = (occurrence: any) => {
    setSelectedOccurrence(occurrence);
  };

  const handleCloseView = () => {
    setSelectedOccurrence(null);
  };

  useEffect(() => {
  
    const ctx = document.getElementById("behaviorChart") as HTMLCanvasElement;
    
   
    if (chartInstance) {
      chartInstance.destroy();
    }

   
    const newChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
        datasets: [
          {
            label: "Ocorrências",
            data: [2, 3, 4, 1, 5, 2],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

   
    setChartInstance(newChartInstance);

  
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
  
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-800">
            Sistema de Ocorrências
          </span>
          <div className="flex space-x-4">
            <a className="text-lg text-blue-500 hover:text-blue-700" href="#">
              Dashboard
            </a>
            <a className="text-lg text-blue-500 hover:text-blue-700" href="#">
              Logout
            </a>
          </div>
        </div>
      </nav>

    
      <div className="container mx-auto mt-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Perfil do Aluno</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Dados Pessoais
            </h3>
            <p className="mb-2">
              <strong>Nome:</strong> João Silva
            </p>
            <p className="mb-2">
              <strong>Data de Nascimento:</strong> 01/01/2005
            </p>
            <p className="mb-2">
              <strong>Turma:</strong> 9º Ano B
            </p>
            <p className="mb-2">
              <strong>Email:</strong> joao.silva@escola.com
            </p>
          </div>

     
          <div className="col-span-2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Histórico de Ocorrências
              </h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Data
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Descrição
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="py-3 px-4">2024-06-01</td>
                    <td className="py-3 px-4">Indisciplina</td>
                    <td className="py-3 px-4">
                      Faltou com respeito ao professor.
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() =>
                          handleViewOccurrence({
                            data: "2024-06-01",
                            tipo: "Indisciplina",
                            descricao: "Faltou com respeito ao professor.",
                          })
                        }
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                
                </tbody>
              </table>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Gráfico de Comportamento
              </h3>
              <canvas id="behaviorChart" className="w-full"></canvas>
            </div>
          </div>
        </div>
      </div>

    
      {selectedOccurrence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-lg">
            <h5 className="text-2xl font-bold mb-4">Visualizar Ocorrência</h5>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={selectedOccurrence.data}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <input
                className="border p-2 rounded w-full"
                value={selectedOccurrence.tipo}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                className="border p-2 rounded w-full"
                value={selectedOccurrence.descricao}
                disabled
              />
            </div>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={handleCloseView}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
