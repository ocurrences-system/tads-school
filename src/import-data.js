const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = {
  users: [
    {
      id: "bae2",
      nome: "Victor Lara",
      email: "victordxloko1@hotmail.com",
      funcao: "Professor",
      senha: "1234",
    },
  ],
  students: [
    {
      id: "1",
      nome: "João Silva",
      email: "joao.silva@escola.com",
      turma: "9º Ano B",
      data_nascimento: "2005-01-01",
    },
  ],
  occurrences: [
    {
      id: "af2e",
      aluno: "João Silva",
      data: "2024-10-03",
      tipo: "Indisciplina",
      descricao: "Interrompeu a aula diversas vezes falando alto.",
      decisao: "Advertência verbal aplicada pelo professor.",
    },
    {
      id: "aaa6",
      aluno: "Maria Oliveira",
      data: "2024-10-10",
      tipo: "Falta de Tarefa",
      descricao: "Não entregou a tarefa de matemática pela terceira vez consecutiva.",
      decisao: "Notificação enviada aos responsáveis.",
    },
    {
      id: "c42c",
      aluno: "Carlos Santos",
      data: "2024-10-15",
      tipo: "Agressão",
      descricao: "Empurrou um colega durante o intervalo.",
      decisao: "Encaminhado para a coordenação e suspenso por 2 dias.",
    },
    {
      id: "a2df",
      aluno: "Ana Paula",
      data: "2024-10-20",
      tipo: "Uso Inadequado de Celular",
      descricao: "Foi flagrada usando o celular durante a prova.",
      decisao: "Celular recolhido e informado aos responsáveis.",
    },
  ],
};

async function main() {
  // Inserir usuários
  await prisma.user.createMany({
    data: data.users,
  });

  // Inserir alunos
  await prisma.student.createMany({
    data: data.students.map((student) => ({
      ...student,
      data_nascimento: new Date(student.data_nascimento),
    })),
  });

  // Inserir ocorrências
  await prisma.occurrence.createMany({
    data: data.occurrences.map((occurrence) => ({
      ...occurrence,
      data: new Date(occurrence.data),
    })),
  });

  console.log('Dados importados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
