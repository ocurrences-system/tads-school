import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { login, password } = credentials || {};

        if (!login || !password) {
          throw new Error("Login e senha são obrigatórios.");
        }

        const user = await prisma.user.findUnique({
          where: { login },
          select: {
            id: true,
            nome: true,
            login: true,
            senha: true,
            funcao: {
              select: {
                id: true,
                nome: true,
              },
            },
            foto: true,
          },
        });

        if (!user) {
          throw new Error("Credenciais inválidas.");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.senha);
        if (!isPasswordCorrect) {
          throw new Error("Senha inválida.");
        }

        return {
          id: user.id,
          name: user.nome,
          login: user.login,
          role: user.funcao.nome,
          foto: user.foto,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.role = user.role;
        token.name = user.name;
        token.foto = user.foto;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        login: token.login,
        role: token.role,
        name: token.name,
        foto: token.foto,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
