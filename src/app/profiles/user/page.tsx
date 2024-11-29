"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  // Fetch dos detalhes do usuário no backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/user"); // Ajuste o endpoint conforme necessário
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do usuário.");
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (isLoading) {
    return <p className="text-center mt-10">Carregando informações do usuário...</p>;
  }

  if (!userDetails) {
    return (
      <p className="text-center mt-10 text-red-500">
        Não foi possível carregar as informações do usuário.
      </p>
    );
  }

  const { nome, login, funcao, foto } = userDetails;

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card com informações do usuário */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Perfil do Usuário</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <img
                  src={foto || "/images/placeholder-user.png"}
                  alt="Foto do usuário"
                  className="w-32 h-32 rounded-full border mb-4"
                />
                <p className="text-lg font-bold">{nome || "Nome não disponível"}</p>
                <p className="text-gray-600">{login || "Login não disponível"}</p>
                <p className="text-gray-600">{funcao || "Função não disponível"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Opções rápidas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Acesso Rápido</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button asChild>
                    <Link href="/profiles/edit">Editar Perfil</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/settings">Configurações</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/dashboard">Voltar ao Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
