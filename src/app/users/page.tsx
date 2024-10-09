"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    funcao: "Professor",
    senha: "",
  })

  const handleFormChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    alert("Usuário salvo: " + JSON.stringify(formData))
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
          <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
          <Button onClick={() => setIsAddModalOpen(true)}>Adicionar Usuário</Button>
        </div>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Usuários</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Maria Oliveira</TableCell>
                  <TableCell>maria@escola.com</TableCell>
                  <TableCell>Professor</TableCell>
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

      {/* Modal Adicionar Usuário */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Nome do Usuário"
                  name="nome"
                  onChange={handleFormChange}
                  value={formData.nome}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleFormChange}
                  value={formData.email}
                />
              </div>
              <div>
                <Label htmlFor="funcao">Função</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, funcao: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Pedagógico">Pedagógico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Senha"
                  name="senha"
                  onChange={handleFormChange}
                  value={formData.senha}
                />
              </div>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Usuário */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {/* Formulário similar ao de adicionar */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
