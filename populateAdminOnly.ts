import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  // Limpa os dados existentes
  await prisma.tipoCounter.deleteMany();
  await prisma.occurrence.deleteMany();
  await prisma.student.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.tipo.deleteMany();
  await prisma.user.deleteMany();
  await prisma.funcao.deleteMany();

  console.log("Banco de dados limpo!");

  // Criação de funções
  const adminFuncao = await prisma.funcao.create({
    data: { id: "1", nome: "Administrador", poder: 75 },
  });

  console.log("Funções criadas:", [adminFuncao]);

  // Geração de hashes para as senhas
  const hashedAdminPassword = await bcrypt.hash("admin", 10);

  // Criação de usuários
  const usuarioAdmin = await prisma.user.create({
    data: {
      id: "1",
      nome: "Administrador",
      login: "admin",
      senha: hashedAdminPassword, // Salva a senha com hash
      funcaoId: adminFuncao.id,
    },
  });

  console.log("Usuário admin criado:", [usuarioAdmin]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
