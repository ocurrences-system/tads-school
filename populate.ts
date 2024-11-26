import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpa os dados existentes
  await prisma.tipoCounter.deleteMany();
  await prisma.occurrence.deleteMany();
  await prisma.student.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.tipo.deleteMany();
  await prisma.user.deleteMany();

  console.log("Banco de dados limpo!");

  // Criação de usuário de teste
  const usuarioTeste = await prisma.user.create({
    data: {
      id: "1", // ID numérico para simplificação
      nome: "Administrador",
      email: "admin@escola.com",
      senha: "senha123", // Lembre-se de utilizar hash em senhas reais
      funcao: "Administrador", // Campo obrigatório
    },
  });

  console.log("Usuário de teste criado:", usuarioTeste);

  // Criação de turmas
  const turma1 = await prisma.turma.create({ data: { id: "1", nome: "9º Ano A" } });
  const turma2 = await prisma.turma.create({ data: { id: "2", nome: "9º Ano B" } });
  const turma3 = await prisma.turma.create({ data: { id: "3", nome: "9º Ano C" } });

  console.log("Turmas criadas:", [turma1, turma2, turma3]);

  // Criação de alunos
  const alunos = await prisma.student.createMany({
    data: [
      { id: "1", nome: "João Silva", email: "joao.silva@escola.com", turmaId: turma1.id, data_nascimento: new Date("2005-01-01") },
      { id: "2", nome: "Maria Oliveira", email: "maria.oliveira@escola.com", turmaId: turma1.id, data_nascimento: new Date("2005-03-15") },
      { id: "3", nome: "Carlos Souza", email: "carlos.souza@escola.com", turmaId: turma2.id, data_nascimento: new Date("2005-05-21") },
      { id: "4", nome: "Ana Costa", email: "ana.costa@escola.com", turmaId: turma2.id, data_nascimento: new Date("2005-08-12") },
      { id: "5", nome: "Paulo Lima", email: "paulo.lima@escola.com", turmaId: turma3.id, data_nascimento: new Date("2005-10-25") },
      { id: "6", nome: "Lucia Menezes", email: "lucia.menezes@escola.com", turmaId: turma3.id, data_nascimento: new Date("2005-12-30") },
    ],
  });

  console.log("Alunos criados:", alunos);

  // Criação de tipos de ocorrência
  const tipo1 = await prisma.tipo.create({ data: { id: "1", nome: "Indisciplina", gravidade: 3 } });
  const tipo2 = await prisma.tipo.create({ data: { id: "2", nome: "Falta", gravidade: 2 } });
  const tipo3 = await prisma.tipo.create({ data: { id: "3", nome: "Atraso", gravidade: 1 } });

  console.log("Tipos de ocorrência criados:", [tipo1, tipo2, tipo3]);

  // Criação de ocorrências
  const ocorrencias = await prisma.occurrence.createMany({
    data: [
      {
        id: "1",
        alunoId: "1",
        usuarioId: "1", // ID do usuário de teste
        tipoId: tipo1.id,
        data: new Date("2024-11-01"),
        descricao: "Falta de respeito com colegas.",
        decisao: "Advertência verbal.",
      },
      {
        id: "2",
        alunoId: "2",
        usuarioId: "1",
        tipoId: tipo2.id,
        data: new Date("2024-11-02"),
        descricao: "Ausência não justificada.",
        decisao: "Registrar falta.",
      },
      {
        id: "3",
        alunoId: "3",
        usuarioId: "1",
        tipoId: tipo3.id,
        data: new Date("2024-11-03"),
        descricao: "Chegou 20 minutos atrasado.",
        decisao: "Orientação de pontualidade.",
      },
    ],
  });

  console.log("Ocorrências criadas:", ocorrencias);

  console.log("Banco de dados populado com sucesso!");
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
