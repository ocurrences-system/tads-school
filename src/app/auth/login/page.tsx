"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: login, senha: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao tentar fazer login.");
      }

      const user = await response.json();
      console.log("Usuário autenticado:", user);

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erro ao fazer login:", err.message);
      setError(err.message || "Erro ao tentar fazer login. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl">
        <Card>
          <CardHeader className="text-center">
            <img
              src="/logoTCC.png"
              alt="Logo"
              className="mx-auto mb-6 w-35 h-35 object-contain"
            />
            <h3 className="text-3xl font-bold text-gray-800">Login</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                  Usuário
                </label>
                <Input
                  type="text"
                  id="login"
                  placeholder="Digite seu login"
                  className="mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  className="mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <Button
                type="submit"
                className={`${buttonVariants({ variant: "outline" })} bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
              >
                Entrar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Esqueceu a senha?
            </Link>
          </CardFooter>
        </Card>
      </div>
      <footer className="absolute bottom-4 text-gray-600 text-xs">
        © 2024 - TADS School
      </footer>
    </div>
  );
}
