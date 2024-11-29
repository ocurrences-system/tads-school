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
  await prisma.funcao.deleteMany();

  console.log("Banco de dados limpo!");

  // Criação de funções
  const adminFuncao = await prisma.funcao.create({
    data: { id: "1", nome: "Administrador", poder: 75 },
  });
  const pedagogaFuncao = await prisma.funcao.create({
    data: { id: "2", nome: "Pedagoga", poder: 10 },
  });

  console.log("Funções criadas:", [adminFuncao, pedagogaFuncao]);

  // Criação de usuários
  const usuarioAdmin = await prisma.user.create({
    data: {
      id: "1",
      nome: "Administrador",
      login: "admin",
      senha: "admin", // Use hash em produção
      funcaoId: adminFuncao.id,
    },
  });

  const usuarioPedagoga = await prisma.user.create({
    data: {
      id: "2",
      nome: "Pedagoga",
      login: "pedagoga",
      senha: "pedagoga", // Use hash em produção
      funcaoId: pedagogaFuncao.id,
    },
  });

  console.log("Usuários criados:", [usuarioAdmin, usuarioPedagoga]);

  // Criação de turmas originais e novas
  const turma1 = await prisma.turma.create({ data: { id: "1", nome: "9º Ano A", ano: 2024 } });
  const turma2 = await prisma.turma.create({ data: { id: "2", nome: "9º Ano B", ano: 2024 } });
  const turma3 = await prisma.turma.create({ data: { id: "3", nome: "9º Ano C", ano: 2024 } });
  const turma4 = await prisma.turma.create({ data: { id: "4", nome: "8º Ano A", ano: 2024 } });
  const turma5 = await prisma.turma.create({ data: { id: "5", nome: "8º Ano B", ano: 2024 } });
  const turma6 = await prisma.turma.create({ data: { id: "6", nome: "8º Ano C", ano: 2024 } });
  const turma7 = await prisma.turma.create({ data: { id: "7", nome: "8º Ano A", ano: 2023 } });
  const turma8 = await prisma.turma.create({ data: { id: "8", nome: "8º Ano B", ano: 2023 } });
  const turma9 = await prisma.turma.create({ data: { id: "9", nome: "8º Ano C", ano: 2023 } });
  const turma10 = await prisma.turma.create({ data: { id: "10", nome: "9º Ano A", ano: 2023 } });
  const turma11 = await prisma.turma.create({ data: { id: "11", nome: "9º Ano B", ano: 2023 } });
  const turma12 = await prisma.turma.create({ data: { id: "12", nome: "9º Ano C", ano: 2023 } });

  console.log("Turmas criadas:", [
    turma1,
    turma2,
    turma3,
    turma4,
    turma5,
    turma6,
    turma7,
    turma8,
    turma9,
    turma10,
    turma11,
    turma12,
  ]);

  // Criação de alunos
  await prisma.student.createMany({
    data: [
      { id: "1", nome: "João Silva", email: "joao.silva@escola.com", turmaId: turma1.id, data_nascimento: new Date("2005-01-01") },
      { id: "2", nome: "Maria Oliveira", email: "maria.oliveira@escola.com", turmaId: turma1.id, data_nascimento: new Date("2005-03-15") },
      { id: "3", nome: "Carlos Souza", email: "carlos.souza@escola.com", turmaId: turma2.id, data_nascimento: new Date("2005-05-21") },
      { id: "4", nome: "Ana Costa", email: "ana.costa@escola.com", turmaId: turma2.id, data_nascimento: new Date("2005-08-12") },
      { id: "5", nome: "Paulo Lima", email: "paulo.lima@escola.com", turmaId: turma3.id, data_nascimento: new Date("2005-10-25") },
      { id: "6", nome: "Lucia Menezes", email: "lucia.menezes@escola.com", turmaId: turma3.id, data_nascimento: new Date("2005-12-30") },
      { id: "7", nome: "Fernanda Rocha", email: "fernanda.rocha@escola.com", turmaId: turma4.id, data_nascimento: new Date("2005-04-10") },
      { id: "8", nome: "Guilherme Santos", email: "guilherme.santos@escola.com", turmaId: turma4.id, data_nascimento: new Date("2005-06-18") },
      { id: "9", nome: "Beatriz Nogueira", email: "beatriz.nogueira@escola.com", turmaId: turma5.id, data_nascimento: new Date("2005-08-02") },
      { id: "10", nome: "Rafael Moreira", email: "rafael.moreira@escola.com", turmaId: turma5.id, data_nascimento: new Date("2005-10-22") },
      { id: "11", nome: "Marcelo Pires", email: "marcelo.pires@escola.com", turmaId: turma6.id, data_nascimento: new Date("2005-12-01") },
      { id: "12", nome: "Patrícia Almeida", email: "patricia.almeida@escola.com", turmaId: turma6.id, data_nascimento: new Date("2005-09-12") },
    ],
  });

  console.log("Alunos criados manualmente.");

  // Criação de tipos de ocorrência
  const tipo1 = await prisma.tipo.create({ data: { id: "1", nome: "Indisciplina Nível 1", gravidade: 1 } });
  const tipo2 = await prisma.tipo.create({ data: { id: "2", nome: "Indisciplina Nível 2", gravidade: 2 } });
  const tipo3 = await prisma.tipo.create({ data: { id: "3", nome: "Indisciplina Nível 3", gravidade: 3 } });

  console.log("Tipos de ocorrência criados:", [tipo1, tipo2, tipo3]);

  // Criação de ocorrências manualmente
  await prisma.occurrence.createMany({
    data: [
      // Ocorrências para João Silva
      {
        id: "1",
        alunoId: "1",
        usuarioId: "1",
        tipoId: "1",
        data: new Date("2024-11-01"),
        descricao: "Falta de respeito com colegas.",
        decisao: "Advertência verbal.",
      },
      {
        id: "2",
        alunoId: "1",
        usuarioId: "2",
        tipoId: "2",
        data: new Date("2024-11-10"),
        descricao: "Chegou atrasado para a aula.",
        decisao: "Orientação de pontualidade.",
      },
  
      // Ocorrências para Maria Oliveira
      {
        id: "3",
        alunoId: "2",
        usuarioId: "1",
        tipoId: "2",
        data: new Date("2024-10-15"),
        descricao: "Ausência não justificada.",
        decisao: "Registrar falta.",
      },
      {
        id: "4",
        alunoId: "2",
        usuarioId: "2",
        tipoId: "3",
        data: new Date("2024-10-20"),
        descricao: "Conversando durante a aula.",
        decisao: "Advertência verbal.",
      },
  
      // Ocorrências para Carlos Souza
      {
        id: "5",
        alunoId: "3",
        usuarioId: "1",
        tipoId: "1",
        data: new Date("2024-09-05"),
        descricao: "Briga com outro aluno.",
        decisao: "Suspensão de 1 dia.",
      },
  
      // Ocorrências para Ana Costa
      {
        id: "6",
        alunoId: "4",
        usuarioId: "2",
        tipoId: "3",
        data: new Date("2024-09-25"),
        descricao: "Esqueceu o material didático.",
        decisao: "Orientação para se organizar melhor.",
      },
      {
        id: "7",
        alunoId: "4",
        usuarioId: "1",
        tipoId: "2",
        data: new Date("2024-10-05"),
        descricao: "Ausência sem justificativa.",
        decisao: "Registrar falta.",
      },
  
      // Ocorrências para Paulo Lima
      {
        id: "8",
        alunoId: "5",
        usuarioId: "1",
        tipoId: "1",
        data: new Date("2024-08-15"),
        descricao: "Desrespeito com o professor.",
        decisao: "Advertência verbal.",
      },
      {
        id: "9",
        alunoId: "5",
        usuarioId: "2",
        tipoId: "3",
        data: new Date("2024-08-20"),
        descricao: "Uso de celular durante a aula.",
        decisao: "Celular confiscado por 1 dia.",
      },
      {
        id: "10",
        alunoId: "5",
        usuarioId: "1",
        tipoId: "2",
        data: new Date("2024-09-10"),
        descricao: "Chegada atrasada.",
        decisao: "Recomendação para ajustar o horário.",
      },
  
      // Ocorrências para Lucia Menezes
      {
        id: "11",
        alunoId: "6",
        usuarioId: "2",
        tipoId: "2",
        data: new Date("2024-08-18"),
        descricao: "Ausência justificada.",
        decisao: "Sem penalidade.",
      },
  
      // Ocorrências para Fernanda Rocha
      {
        id: "12",
        alunoId: "7",
        usuarioId: "1",
        tipoId: "1",
        data: new Date("2024-09-01"),
        descricao: "Discussão com colega em sala.",
        decisao: "Advertência verbal.",
      },
  
      // Ocorrências para Guilherme Santos
      {
        id: "13",
        alunoId: "8",
        usuarioId: "2",
        tipoId: "3",
        data: new Date("2024-10-10"),
        descricao: "Interrompeu a aula várias vezes.",
        decisao: "Conversa com a coordenação.",
      },
      {
        id: "14",
        alunoId: "8",
        usuarioId: "1",
        tipoId: "2",
        data: new Date("2024-10-15"),
        descricao: "Esqueceu o dever de casa.",
        decisao: "Orientação para se organizar.",
      },
  
      // Ocorrências para Beatriz Nogueira
      {
        id: "15",
        alunoId: "9",
        usuarioId: "1",
        tipoId: "1",
        data: new Date("2024-07-30"),
        descricao: "Brincadeira inadequada na sala.",
        decisao: "Advertência verbal.",
      },
  
      // Ocorrências para Rafael Moreira
      {
        id: "16",
        alunoId: "10",
        usuarioId: "2",
        tipoId: "3",
        data: new Date("2024-11-05"),
        descricao: "Esquecimento de uniforme.",
        decisao: "Registro sem penalidade.",
      },
  
      // Ocorrências para Marcelo Pires
      {
        id: "17",
        alunoId: "11",
        usuarioId: "1",
        tipoId: "2",
        data: new Date("2024-08-15"),
        descricao: "Atraso na entrada.",
        decisao: "Recomendação para ajustar rotina.",
      },
      {
        id: "18",
        alunoId: "11",
        usuarioId: "2",
        tipoId: "3",
        data: new Date("2024-09-01"),
        descricao: "Interrupções constantes na aula.",
        decisao: "Conversa com pais.",
      },
  
      // Ocorrências para Patrícia Almeida
      {
        id: "19",
        alunoId: "12",
        usuarioId: "1",
        tipoId: "1",
        data: new Date("2024-07-20"),
        descricao: "Desrespeito com colegas.",
        decisao: "Advertência formal.",
      },
    ],
  });

  console.log("Ocorrências criadas manualmente.");

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
