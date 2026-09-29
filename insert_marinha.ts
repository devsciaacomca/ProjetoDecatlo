import "dotenv/config";
import { prisma } from "./lib/prisma";

const questoes = [
  {
    enunciado: "Quando foi oficialmente criada a Marinha do Brasil sob a bandeira nacional?",
    alternativas: [
      "Em 1500, com o descobrimento do Brasil",
      "Em 1808, com a chegada da Família Real",
      "Em 1822, após a Independência do Brasil",
      "Em 1889, com a Proclamação da República"
    ],
    respostaCorreta: "Em 1822, após a Independência do Brasil"
  },
  {
    enunciado: "Quem foi o primeiro Comandante-em-Chefe da Esquadra Brasileira logo após a Independência, contratado por D. Pedro I?",
    alternativas: [
      "Marquês de Tamandaré",
      "Lord Thomas Cochrane",
      "Francisco Manuel Barroso",
      "João Cândido"
    ],
    respostaCorreta: "Lord Thomas Cochrane"
  },
  {
    enunciado: "Qual figura histórica é considerada o Patrono da Marinha do Brasil?",
    alternativas: [
      "Almirante Barroso",
      "Almirante Tamandaré (Joaquim Marques Lisboa)",
      "Duque de Caxias",
      "Marechal Deodoro da Fonseca"
    ],
    respostaCorreta: "Almirante Tamandaré (Joaquim Marques Lisboa)"
  },
  {
    enunciado: "Qual foi a mais importante batalha naval ocorrida durante a Guerra do Paraguai, em 11 de junho de 1865?",
    alternativas: [
      "Batalha de Monte Caseros",
      "Batalha de Curupaiti",
      "Batalha do Riachuelo",
      "Batalha de Tuyutí"
    ],
    respostaCorreta: "Batalha do Riachuelo"
  },
  {
    enunciado: "O Almirante Francisco Manuel Barroso da Silva destacou-se e tornou-se herói em qual grande conflito sul-americano?",
    alternativas: [
      "Guerra Cisplatina",
      "Revolução Farroupilha",
      "Guerra do Paraguai",
      "Segunda Guerra Mundial"
    ],
    respostaCorreta: "Guerra do Paraguai"
  },
  {
    enunciado: "A Revolta da Chibata, ocorrida em 1910 no Rio de Janeiro, foi liderada por qual marinheiro, que ficou conhecido como o \"Almirante Negro\"?",
    alternativas: [
      "João Cândido",
      "Tiradentes",
      "Zumbi dos Palmares",
      "Francisco José do Nascimento (Dragão do Mar)"
    ],
    respostaCorreta: "João Cândido"
  },
  {
    enunciado: "Qual era a principal reivindicação dos marinheiros amotinados na Revolta da Chibata?",
    alternativas: [
      "Aumento de salário e melhores aposentadorias",
      "Fim dos castigos físicos (chibatadas) na corporação",
      "O direito de votar e participar da política",
      "Melhoria exclusiva na qualidade da alimentação"
    ],
    respostaCorreta: "Fim dos castigos físicos (chibatadas) na corporação"
  },
  {
    enunciado: "Durante a Primeira Guerra Mundial (1914-1918), a Marinha do Brasil enviou uma força-tarefa para patrulhar a costa oeste da África. Como se chamava essa força?",
    alternativas: [
      "Força Expedicionária Brasileira (FEB)",
      "Força de Paz do Atlântico",
      "Esquadra de Evoluções",
      "Divisão Naval em Operações de Guerra (DNOG)"
    ],
    respostaCorreta: "Divisão Naval em Operações de Guerra (DNOG)"
  },
  {
    enunciado: "No início do século XX, o Brasil adquiriu dois dos mais poderosos encouraçados (dreadnoughts) do mundo, gerando uma corrida armamentista na América do Sul. Quais eram os nomes desses navios?",
    alternativas: [
      "Rio de Janeiro e Bahia",
      "Tamandaré e Barroso",
      "Minas Geraes e São Paulo",
      "Atlântico e Ceará"
    ],
    respostaCorreta: "Minas Geraes e São Paulo"
  },
  {
    enunciado: "Durante a Segunda Guerra Mundial, qual foi o principal papel desempenhado pela Marinha do Brasil?",
    alternativas: [
      "Combate direto contra a frota japonesa no Oceano Pacífico",
      "Patrulha do Atlântico Sul e escolta de comboios mercantes contra submarinos",
      "Desembarque anfíbio na Normandia (Dia D)",
      "Defesa do Mar Mediterrâneo ao lado da Marinha Britânica"
    ],
    respostaCorreta: "Patrulha do Atlântico Sul e escolta de comboios mercantes contra submarinos"
  },
  {
    enunciado: "O Corpo de Fuzileiros Navais do Brasil tem sua origem histórica ligada à chegada da Família Real Portuguesa em 1808. Qual era o nome original dessa tropa?",
    alternativas: [
      "Brigada Real da Marinha",
      "Guarda Nacional Imperial",
      "Tropa de Choque Anfíbia",
      "Força de Elite Naval"
    ],
    respostaCorreta: "Brigada Real da Marinha"
  },
  {
    enunciado: "O Programa de Desenvolvimento de Submarinos (PROSUB) da Marinha do Brasil tem como um de seus principais objetivos estratégicos a construção de:",
    alternativas: [
      "Um porta-aviões com propulsão nuclear",
      "Um submarino de propulsão nuclear",
      "Dez contratorpedeiros stealth",
      "Uma base naval permanente na Antártica"
    ],
    respostaCorreta: "Um submarino de propulsão nuclear"
  },
  {
    enunciado: "Qual é o nome do atual Navio-Aeródromo Multipropósito (NAM) da Marinha do Brasil, que atua como o navio-capitânia da esquadra desde 2018?",
    alternativas: [
      "São Paulo",
      "Minas Gerais",
      "Atlântico",
      "Bahia"
    ],
    respostaCorreta: "Atlântico"
  },
  {
    enunciado: "Qual revolta ocorreu na década de 1890, na qual navios da Marinha do Brasil no Rio de Janeiro se voltaram contra o governo republicano, especialmente contra o Marechal Floriano Peixoto?",
    alternativas: [
      "Revolta da Vacina",
      "Revolução Constitucionalista",
      "Revolta da Armada",
      "Cabanagem"
    ],
    respostaCorreta: "Revolta da Armada"
  },
  {
    enunciado: "Onde está localizada a Escola Naval, a instituição de ensino superior mais antiga do Brasil e que forma os Oficiais da Marinha?",
    alternativas: [
      "Ilha de Villegagnon, no Rio de Janeiro",
      "Brasília, no Distrito Federal",
      "São Salvador, na Bahia",
      "Baixada Santista, em São Paulo"
    ],
    respostaCorreta: "Ilha de Villegagnon, no Rio de Janeiro"
  },
  {
    enunciado: "O termo \"Amazônia Azul\" foi criado pela Marinha do Brasil para designar e proteger qual área?",
    alternativas: [
      "Os rios da bacia amazônica patrulhados pela flotilha fluvial",
      "A Zona Econômica Exclusiva (ZEE) e a plataforma continental brasileira no Oceano Atlântico",
      "Uma vasta reserva biológica submersa no arquipélago de Fernando de Noronha",
      "A fronteira marítima disputada com a Guiana Francesa"
    ],
    respostaCorreta: "A Zona Econômica Exclusiva (ZEE) e a plataforma continental brasileira no Oceano Atlântico"
  },
  {
    enunciado: "Os Navios de Assistência Hospitalar (NAsH) da Marinha do Brasil prestam atendimento médico e odontológico às populações ribeirinhas da Amazônia e do Pantanal. Como eles são carinhosamente chamados por essas populações?",
    alternativas: [
      "Anjos das Águas",
      "Doutores do Rio",
      "Navios da Esperança",
      "Cruzadores da Saúde"
    ],
    respostaCorreta: "Navios da Esperança"
  },
  {
    enunciado: "O Brasil liderou a Missão das Nações Unidas para a Estabilização no Haiti (MINUSTAH) de 2004 a 2017. A Marinha contribuiu significativamente enviando:",
    alternativas: [
      "Submarinos para bloquear os portos de Porto Príncipe",
      "Tropas do Corpo de Fuzileiros Navais e navios de apoio logístico",
      "Caças interceptadores navais",
      "Apenas oficiais médicos e enfermeiros"
    ],
    respostaCorreta: "Tropas do Corpo de Fuzileiros Navais e navios de apoio logístico"
  },
  {
    enunciado: "Qual famoso navio-aeródromo brasileiro, adquirido da França e incorporado no ano de 2000, serviu como o principal porta-aviões da frota até ser desativado em 2017?",
    alternativas: [
      "NAeL Minas Gerais",
      "NDD Ceará",
      "NDCC Mattoso Maia",
      "NAe São Paulo"
    ],
    respostaCorreta: "NAe São Paulo"
  },
  {
    enunciado: "Na Guerra da Tríplice Aliança (Guerra do Paraguai), a Marinha do Brasil teve papel crucial no controle de qual importante rota de suprimentos e transporte estratégico?",
    alternativas: [
      "Bacia do Rio Paraná e Rio Paraguai",
      "Estuário do Rio Amazonas",
      "Canal do Panamá",
      "Delta do Rio Orinoco"
    ],
    respostaCorreta: "Bacia do Rio Paraná e Rio Paraguai"
  }
];

async function main() {
  let criadas = 0;
  for (const q of questoes) {
    const p = await prisma.pergunta.create({
      data: {
        enunciado: q.enunciado,
        assunto: "Marinha do Brasil",
        tipo: "objetiva",
        respostaCorreta: q.respostaCorreta,
        explicacao: "",
        alternativas: {
          create: q.alternativas.map((texto) => ({ texto })),
        },
      },
    });
    console.log(`Criada: ${p.id} - ${p.enunciado.substring(0, 30)}...`);
    criadas++;
  }
  console.log(`\nSucesso! ${criadas} perguntas inseridas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
