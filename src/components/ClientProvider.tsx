"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <SessionProvider>
      <Navbar /> {/* Incluindo o Navbar em todas as páginas */}
      {children}
    </SessionProvider>
  );
}
