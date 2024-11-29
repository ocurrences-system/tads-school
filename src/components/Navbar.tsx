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

    console.log("Sessão do usuário navbar:", session); // Debug para verificar a sessão
    //console.log("Foto do usuário no callback de sessão:", session.user.foto);
    if (session) {
        console.log("Foto do usuário:", session.user.foto);
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const userPhoto = session?.user?.foto
        ? session.user?.foto // URL ou caminho armazenado no banco
        : "/user.png"; // Imagem padrão

    return (
        <nav className="bg-white shadow fixed top-0 left-0 w-full z-10">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-start">
                        <Link href="/dashboard" className="text-lg font-bold text-gray-800">
                            TADS-School
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center space-x-2">
                                        <img
                                            src={userPhoto}
                                            alt="Foto do usuário"
                                            className="w-8 h-8 rounded-full border"
                                        />
                                        <span>Bem-vindo, {session.user?.name || "Usuário"}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profiles/user">Perfil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        Sair
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/auth/login" className="text-sm text-blue-500 hover:underline">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
