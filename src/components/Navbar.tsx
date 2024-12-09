"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const { data: session } = useSession(); // Hook para acessar a sessão do usuário

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const userPhoto = session?.user?.foto
        ? session.user?.foto // URL ou caminho armazenado no banco
        : "/user.png"; // Imagem padrão

    return (
        <nav className="bg-black bg-opacity-70 shadow-md fixed top-0 left-0 w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Logo ou título no extremo esquerdo */}
                    <div className="flex items-center justify-start">
                        <Link href="/dashboard" className="text-2xl font-semibold text-white">
                            TADS-School
                        </Link>
                    </div>

                    {/* Ações do usuário no extremo direito */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 text-white hover:bg-opacity-80 focus:ring-2 focus:ring-white"
                                    >
                                        <img
                                            src={userPhoto}
                                            alt="Foto do usuário"
                                            className="w-10 h-10 rounded-full border border-white"
                                        />
                                        <span className="hidden sm:inline">
                                            Bem-vindo, {session.user?.name || "Usuário"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 bg-white rounded-md shadow-lg">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profiles/user" className="text-gray-800 hover:text-blue-600">
                                            Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="border-t my-1" />
                                    <DropdownMenuItem
                                        onClick={handleSignOut}
                                        className="text-red-500 hover:bg-red-50"
                                    >
                                        Sair
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="text-sm text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
