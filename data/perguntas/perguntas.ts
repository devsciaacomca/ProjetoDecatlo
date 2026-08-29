
import type { Pergunta } from "@/types/perguntas";

export const perguntas: Pergunta[] = [
  {
    id: 128,
    assunto: "História",
    tipo: "objetiva",
    enunciado:
      "Em que ano ocorreu a Proclamação da República no Brasil?",
    alternativas: [
      { id: 1, texto: "1822" },
      { id: 2, texto: "1888" },
      { id: 3, texto: "1889" },
    ],
    respostaCorreta: "1889",
    explicacao:
      "A Proclamação da República ocorreu em 15 de novembro de 1889, encerrando o período do Império no Brasil.",
    criadaEm: "14/08/2026",
  },

  {
    id: 127,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado:
      "Qual é o maior país da América do Sul em território?",
    alternativas: [
      { id: 1, texto: "Argentina" },
      { id: 2, texto: "Brasil" },
      { id: 3, texto: "Colômbia" },
    ],
    respostaCorreta: "Brasil",
    explicacao:
      "O Brasil é o maior país da América do Sul, ocupando aproximadamente metade da área do continente.",
    criadaEm: "14/08/2026",
  },

  {
    id: 126,
    assunto: "Matemática",
    tipo: "aberta",
    enunciado:
      "Explique o conceito de média aritmética.",
    respostaCorreta:
      "A média aritmética é obtida somando todos os valores e dividindo o resultado pela quantidade de valores.",
    explicacao:
      "Por exemplo, para os valores 10, 20 e 30, somamos 60 e dividimos por 3. A média é 20.",
    criadaEm: "13/08/2026",
  },

  {
    id: 125,
    assunto: "Português",
    tipo: "objetiva",
    enunciado:
      "Qual das alternativas apresenta um substantivo?",
    alternativas: [
      { id: 1, texto: "Correr" },
      { id: 2, texto: "Casa" },
      { id: 3, texto: "Bonito" },
    ],
    respostaCorreta: "Casa",
    explicacao:
      "Casa é um substantivo porque nomeia um ser ou objeto. Correr é verbo e bonito é adjetivo.",
    criadaEm: "13/08/2026",
  },

  {
    id: 124,
    assunto: "Atualidades",
    tipo: "aberta",
    enunciado:
      "Explique a importância da preservação ambiental.",
    respostaCorreta:
      "A preservação ambiental busca proteger os recursos naturais e manter o equilíbrio dos ecossistemas.",
    explicacao:
      "A preservação ambiental contribui para a biodiversidade, qualidade de vida e disponibilidade de recursos naturais.",
    criadaEm: "12/08/2026",
  },

  {
    id: 123,
    assunto: "História",
    tipo: "objetiva",
    enunciado:
      "Quem proclamou a Independência do Brasil?",
    alternativas: [
      { id: 1, texto: "Tiradentes" },
      { id: 2, texto: "Dom Pedro I" },
      { id: 3, texto: "Dom João VI" },
    ],
    respostaCorreta: "Dom Pedro I",
    explicacao:
      "Dom Pedro I proclamou a Independência do Brasil em 7 de setembro de 1822.",
    criadaEm: "12/08/2026",
  },

  {
    id: 122,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado:
      "Qual é a capital do Brasil?",
    alternativas: [
      { id: 1, texto: "Rio de Janeiro" },
      { id: 2, texto: "São Paulo" },
      { id: 3, texto: "Brasília" },
    ],
    respostaCorreta: "Brasília",
    explicacao:
      "Brasília é a capital federal do Brasil desde 21 de abril de 1960.",
    criadaEm: "11/08/2026",
  },

  {
    id: 121,
    assunto: "Matemática",
    tipo: "objetiva",
    enunciado:
      "Quanto é 10 × 5?",
    alternativas: [
      { id: 1, texto: "40" },
      { id: 2, texto: "50" },
      { id: 3, texto: "60" },
    ],
    respostaCorreta: "50",
    explicacao:
      "Multiplicando 10 por 5 obtemos 50.",
    criadaEm: "11/08/2026",
  },

  {
    id: 120,
    assunto: "Português",
    tipo: "aberta",
    enunciado:
      "Explique o que é um verbo.",
    respostaCorreta:
      "Verbo é uma palavra que pode indicar ação, estado ou fenômeno da natureza.",
    explicacao:
      "Palavras como correr, estudar, ser e chover são exemplos de verbos.",
    criadaEm: "10/08/2026",
  },

  {
    id: 119,
    assunto: "História",
    tipo: "objetiva",
    enunciado:
      "Em que ano foi assinada a Lei Áurea?",
    alternativas: [
      { id: 1, texto: "1822" },
      { id: 2, texto: "1888" },
      { id: 3, texto: "1889" },
    ],
    respostaCorreta: "1888",
    explicacao:
      "A Lei Áurea foi assinada em 13 de maio de 1888 e aboliu oficialmente a escravidão no Brasil.",
    criadaEm: "10/08/2026",
  },

  {
    id: 118,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado:
      "Qual é o maior oceano do planeta?",
    alternativas: [
      { id: 1, texto: "Oceano Atlântico" },
      { id: 2, texto: "Oceano Índico" },
      { id: 3, texto: "Oceano Pacífico" },
    ],
    respostaCorreta: "Oceano Pacífico",
    explicacao:
      "O Oceano Pacífico é o maior oceano da Terra em área.",
    criadaEm: "09/08/2026",
  },

  {
    id: 117,
    assunto: "Atualidades",
    tipo: "aberta",
    enunciado:
      "Explique o conceito de desenvolvimento sustentável.",
    respostaCorreta:
      "É o desenvolvimento que busca atender às necessidades atuais sem comprometer a capacidade das futuras gerações.",
    explicacao:
      "O conceito procura equilibrar desenvolvimento econômico, proteção ambiental e bem-estar social.",
    criadaEm: "09/08/2026",
  },

  {
    id: 116,
    assunto: "História",
    tipo: "objetiva",
    enunciado:
      "Quem foi o primeiro presidente do Brasil após a Proclamação da República?",
    alternativas: [
      { id: 1, texto: "Deodoro da Fonseca" },
      { id: 2, texto: "Floriano Peixoto" },
      { id: 3, texto: "Getúlio Vargas" },
    ],
    respostaCorreta: "Deodoro da Fonseca",
    explicacao:
      "Marechal Deodoro da Fonseca liderou o movimento de 1889 e tornou-se o primeiro presidente do Brasil.",
    criadaEm: "08/08/2026",
  },

  {
    id: 115,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado:
      "Qual é o rio mais extenso do Brasil?",
    alternativas: [
      { id: 1, texto: "Rio Paraná" },
      { id: 2, texto: "Rio Amazonas" },
      { id: 3, texto: "Rio São Francisco" },
    ],
    respostaCorreta: "Rio Amazonas",
    explicacao:
      "O Rio Amazonas é um dos maiores rios do mundo e possui grande parte de sua extensão em território brasileiro.",
    criadaEm: "08/08/2026",
  },

  {
    id: 114,
    assunto: "Matemática",
    tipo: "objetiva",
    enunciado:
      "Quanto é 12 + 18?",
    alternativas: [
      { id: 1, texto: "20" },
      { id: 2, texto: "30" },
      { id: 3, texto: "40" },
    ],
    respostaCorreta: "30",
    explicacao:
      "Somando 12 e 18 temos 30.",
    criadaEm: "07/08/2026",
  },

  {
    id: 113,
    assunto: "Ciências",
    tipo: "aberta",
    enunciado:
      "Explique o processo de fotossíntese.",
    respostaCorreta:
      "É o processo pelo qual plantas e outros organismos utilizam luz para produzir matéria orgânica a partir de água e gás carbônico.",
    explicacao:
      "A fotossíntese ocorre principalmente nas folhas e envolve a utilização da energia luminosa.",
    criadaEm: "07/08/2026",
  },

  {
    id: 112,
    assunto: "Português",
    tipo: "objetiva",
    enunciado:
      "Qual palavra é um adjetivo?",
    alternativas: [
      { id: 1, texto: "Bonito" },
      { id: 2, texto: "Casa" },
      { id: 3, texto: "Correr" },
    ],
    respostaCorreta: "Bonito",
    explicacao:
      "Bonito é um adjetivo porque caracteriza ou atribui uma qualidade a um substantivo.",
    criadaEm: "06/08/2026",
  },

  {
    id: 111,
    assunto: "História",
    tipo: "aberta",
    enunciado:
      "Explique o que foi a Revolução Industrial.",
    respostaCorreta:
      "Foi um período de grandes transformações econômicas e tecnológicas marcado pela mecanização da produção.",
    explicacao:
      "A Revolução Industrial modificou profundamente a produção, o trabalho e a organização das sociedades.",
    criadaEm: "06/08/2026",
  },

  {
    id: 110,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado:
      "Em qual continente está localizado o Brasil?",
    alternativas: [
      { id: 1, texto: "Europa" },
      { id: 2, texto: "América do Sul" },
      { id: 3, texto: "Ásia" },
    ],
    respostaCorreta: "América do Sul",
    explicacao:
      "O Brasil está localizado na América do Sul e faz fronteira com quase todos os países do continente.",
    criadaEm: "05/08/2026",
  },

  {
    id: 109,
    assunto: "Matemática",
    tipo: "aberta",
    enunciado:
      "Explique o que é uma fração.",
    respostaCorreta:
      "Fração representa uma parte de um todo e normalmente é formada por numerador e denominador.",
    explicacao:
      "Em 3/4, por exemplo, o 3 representa as partes consideradas e o 4 representa o total de partes iguais.",
    criadaEm: "05/08/2026",
  },
];
