"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";

export default function UserProfile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    nome: "",
    senhaAtual: "",
    novaSenha: "",
    foto: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Erro ao carregar dados do usuário.");
        const data = await response.json();
        setUserData(data);
        setFormData({ ...formData, nome: data.nome });
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar os dados do usuário.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("nome", formData.nome);
    if (formData.senhaAtual) formDataToSend.append("senhaAtual", formData.senhaAtual);
    if (formData.novaSenha) formDataToSend.append("novaSenha", formData.novaSenha);
    if (formData.foto) formDataToSend.append("foto", formData.foto);

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar os dados do usuário.");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar os dados do usuário.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto mt-6 max-w-lg">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Perfil do Usuário</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="foto" className="block text-sm font-medium text-gray-700">
                  Foto do Perfil
                </label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {userData?.foto && (
                  <img
                    src={userData.foto}
                    alt="Foto do Perfil"
                    className="mt-4 w-32 h-32 object-cover rounded-full border"
                  />
                )}
              </div>

              <div>
                <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700">
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="senhaAtual"
                  name="senhaAtual"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.senhaAtual}
                  onChange={handleInputChange}
                  placeholder="Deixe em branco se não quiser alterar"
                />
              </div>

              <div>
                <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="novaSenha"
                  name="novaSenha"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.novaSenha}
                  onChange={handleInputChange}
                  placeholder="Deixe em branco se não quiser alterar"
                />
              </div>

              <Button type="submit" className="w-full">
                Atualizar Dados
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
