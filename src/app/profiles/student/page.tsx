"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PerfilAluno() {
  const [showViewModal, setShowViewModal] = useState(false);

  const toggleViewModal = () => setShowViewModal(!showViewModal);

  return (
    <div>
      <nav className="bg-gray-100 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a className="text-lg font-semibold" href="#">
            Sistema de Ocorrências
          </a>
          <div>
            <a className="mr-4 text-blue-500" href="#">
              Dashboard
            </a>
            <a className="text-blue-500" href="#">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Perfil do Aluno</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="col-span-1">
            <Card.Header>Dados Pessoais</Card.Header>
            <Card.Body>
              <p>
                <strong>Nome:</strong> João Silva
              </p>
              <p>
                <strong>Data de Nascimento:</strong> 01/01/2005
              </p>
              <p>
                <strong>Turma:</strong> 9º Ano B
              </p>
              <p>
                <strong>Email:</strong> joao.silva@escola.com
              </p>
            </Card.Body>
          </Card>

          <div className="col-span-2">
            <Card>
              <Card.Header>Histórico de Ocorrências</Card.Header>
              <Card.Body>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.Cell>Data</Table.Cell>
                      <Table.Cell>Tipo</Table.Cell>
                      <Table.Cell>Descrição</Table.Cell>
                      <Table.Cell>Ações</Table.Cell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>2024-06-01</Table.Cell>
                      <Table.Cell>Indisciplina</Table.Cell>
                      <Table.Cell>Faltou com respeito ao professor.</Table.Cell>
                      <Table.Cell>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={toggleViewModal}
                        >
                          Visualizar
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                    {/* Outras linhas de ocorrências */}
                  </Table.Body>
                </Table>
              </Card.Body>
            </Card>

            <Card className="mt-4">
              <Card.Header>Gráfico de Comportamento</Card.Header>
              <Card.Body>
                <canvas id="behaviorChart"></canvas>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal para Visualizar Ocorrência */}
      <Modal isOpen={showViewModal} onClose={toggleViewModal}>
        <Modal.Header>
          <h5 className="modal-title">Visualizar Ocorrência</h5>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="viewData">Data</label>
              <Input id="viewData" type="date" value="2024-06-01" disabled />
            </div>
            <div className="form-group">
              <label htmlFor="viewTipo">Tipo</label>
              <Input id="viewTipo" value="Indisciplina" disabled />
            </div>
            <div className="form-group">
              <label htmlFor="viewDescricao">Descrição</label>
              <Textarea
                id="viewDescricao"
                value="Faltou com respeito ao professor."
                disabled
              />
            </div>
            <Button variant="secondary" onClick={toggleViewModal}>
              Fechar
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Script para inicializar o gráfico usando Chart.js */}
      <script>
        {`
          const ctx = document.getElementById('behaviorChart').getContext('2d');
          new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
              datasets: [{
                label: 'Ocorrências',
                data: [2, 3, 4, 1, 5, 2],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        `}
      </script>
    </div>
  );
}
