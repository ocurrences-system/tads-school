"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Exibe mensagem de erro se houver parâmetro de erro na URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setError("Credenciais inválidas. Verifique suas informações.");
      } else {
        setError("Ocorreu um erro desconhecido. Tente novamente.");
      }
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        login, // Usa o campo login em vez de email
        password,
        redirect: true, // Habilita redirecionamento automático
        callbackUrl: "/dashboard", // Página para redirecionar após o login
      });

      if (result?.error) {
        setError("Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao tentar logar. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white shadow-md rounded-lg space-y-4 w-full max-w-md"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="login" className="block text-sm font-medium text-gray-700">
            Login
          </label>
          <input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Digite seu login"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
