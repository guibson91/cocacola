import { Shift, WeekDay } from "./user";

export const industries: string[] = [
  "MERCADO",
  "PADARIA",
  "RESTAURANTE / PIZZARIA",
  "LANCHONETE / CAFETERIA",
  "FAST-FOOD",
  "BAR / ADEGAS",
  "CONVENIÊNCIA / POSTOS",
  "EDUCAÇÃO (ESCOLAS)",
  "HOTELARIA / CLUBES / LAZER",
  "LOJA DE ALIMENTOS OU DEPARTAMENTOS",
  "OUTROS",
];

export interface Business {
  id: string;
  industryType: string;
  description: string;
}
export const businesses = [
  { id: "AS 1 CHKS", industryType: "MERCADO", description: "POSSUI 1 CAIXA (CHECKOUT)" },
  { id: "AS 2 CHKS", industryType: "MERCADO", description: "POSSUI 2 A 4 CAIXAS (CHECKOUT)" },
  { id: "SUPERMERCADO 5 A 9 CHKS", industryType: "MERCADO", description: "POSSUI 5 A 9 CAIXAS (CHECKOUT)" },
  { id: "SUPERMERCADO 10 A 19 CHKS", industryType: "MERCADO", description: "POSSUI 10 A 19 CAIXAS (CHECKOUT)" },
  { id: "MERCEARIA", industryType: "MERCADO", description: "POSSUI PAGAMENTO VIA BALCÃO" },
  { id: "PADARIA MULTIOCASIÃO", industryType: "PADARIA", description: "PRINCIPAL VENDA PÃES E REFEIÇÃO NO LOCAL" },
  { id: "PADARIA", industryType: "PADARIA", description: "PRINCIPAL VENDA É PÃES SEM REFEIÇÃO NO LOCAL" },
  { id: "CHURRASCARIA", industryType: "RESTAURANTE / PIZZARIA", description: "PRINCIPAL CONSUMO CARNES (CHURRASCARIA)" },
  { id: "PIZZARIA", industryType: "RESTAURANTE / PIZZARIA", description: "PRINCIPAL CONSUMO É PIZZA NO LOCAL" },
  { id: "SHOPPING - RESTAURANTE", industryType: "RESTAURANTE / PIZZARIA", description: "RESTAURANTE DE SHOPPING" },
  { id: "RESTAURANTE", industryType: "RESTAURANTE / PIZZARIA", description: "RESTAURANTE TRADICIONAL CONSUMO PRATOS E SELF-SERVICE" },
  { id: "SELF-SERVICE", industryType: "RESTAURANTE / PIZZARIA", description: "RESTAURANTE SOMENTE CONSUMO SELF-SERVICE" },
  { id: "DELIVERY", industryType: "RESTAURANTE / PIZZARIA", description: "RESTAURANTE E PIZZARIA PRINCIPAL ATIVIDADE ATENDIMENTO DELIVERY" },
  { id: "RESTAURANTE / REFEITÓRIO", industryType: "RESTAURANTE / PIZZARIA", description: "REFEITÓRIO INTERNO DE EMPRESAS" },
  { id: "LANCHONETE", industryType: "LANCHONETE / CAFETERIA", description: "PRINCIPAL ATIVIDADE LANCHE RAPIDOS (LANCHE, SALGADOS, PASTEIS E SEM BEBIDAS ALCOOLICAS)" },
  {
    id: "SHOPPING - LANCHONETE",
    industryType: "LANCHONETE / CAFETERIA",
    description: "PRINCIPAL ATIVIDADE LANCHE RAPIDOS (LANCHE, SALGADOS, PASTEIS E SEM BEBIDAS ALCOOLICAS) DENTRO DO SHOPPING",
  },
  {
    id: "TERMINAL RODOVIÁRIO",
    industryType: "LANCHONETE / CAFETERIA",
    description: "PRINCIPAL ATIVIDADE  LANCHE RAPIDOS (LANCHE, SALGADOS, PASTEIS E SEM BEBIDAS ALCOOLICAS) DENTRO DO TERMINAL RODOVIÁRIO",
  },
  {
    id: "HOSPITAL",
    industryType: "LANCHONETE / CAFETERIA",
    description: "PRINCIPAL ATIVIDADE LANCHE RAPIDOS (LANCHE, SALGADOS, PASTEIS E SEM BEBIDAS ALCOOLICAS) DENTRO DO HOSPITAL",
  },
  { id: "CAFETERIA / DOCERIA", industryType: "LANCHONETE / CAFETERIA", description: "PRINCIOAL ATIVIDADE CONFEITARIA (BOLOS, DOCES E CAFÉS)" },
  { id: "QUIOSQUE", industryType: "LANCHONETE / CAFETERIA", description: "QUIOSQUE" },
  { id: "*SORVETERIA", industryType: "LANCHONETE / CAFETERIA", description: "PRINCIPAL ATIVIDADE CONSUMO DE SORVETES" },
  { id: "TRAILER", industryType: "LANCHONETE / CAFETERIA", description: "PRINCIPAL ATENDIMENTO EM TRAILER OU FOOD TRUCK" },
  { id: "FAST-FOOD", industryType: "FAST-FOOD", description: "PRINCIPAL ATIVIDADE FAST-FOOD (REDES FRANQUIAS)" },
  { id: "BAR", industryType: "BAR / ADEGAS", description: "PRINCIPAL ATIVIDADE É PARA VENDA BEBIDAS ALCOOLICAS PARA CONSUMO NO LOCAL" },
  { id: "BOATE/DISCOTECA/BALADA", industryType: "BAR / ADEGAS", description: "PRINCIPAL ATIVIDADE NOTURNO (BALADA, BOATE OU DISCOTECA)" },
  { id: "CHOPERIA / BAR NOTURNO", industryType: "BAR / ADEGAS", description: "PRINCIPAL ATIVIDADE COM VENDA DE CHOOP NO LOCAL (CHOPERIA) OU BAR NOTURNO" },
  { id: "ADEGA", industryType: "BAR / ADEGAS", description: "PRINCIPAL VENDA DE BEBIDAS EM BAIRRO (ADEGA)" },
  { id: "DEPÓSITO DE BEBIDAS", industryType: "BAR / ADEGAS", description: "PRINCIPAL ATIVIDADE DESTRIBUIÇÃO DE BEBIDAS (DEPÓSITO DE BEBIDAS)" },
  { id: "POSTO DE GASOLINA", industryType: "CONVENIÊNCIA / POSTOS", description: "PRINCIPAL ATIVIDADE VENDA DE COMBUSTÍVEL SEM LANCHONETE" },
  { id: "POSTOS DE ESTRADA", industryType: "CONVENIÊNCIA / POSTOS", description: "PRINCIPAL ATIVIDADE VENDA DE COMBUSTÍVEL COM OU SEM LANCHONETE EM ESTRADAS" },
  { id: "LOJA DE CONVENIÊNCIA", industryType: "CONVENIÊNCIA / POSTOS", description: "LOJA FISÍCA DENTRO DO POSTO DE COMBUSTÍVEL (CONVENIÊNCIA)" },
  { id: "ESCOLAS ENSINO FUNDAMENTAL", industryType: "EDUCAÇÃO (ESCOLAS)", description: "ESCOLA COM MAIOR PERCENTUAL DE ALUNOS EM ENSINO FUNDAMENTAL" },
  { id: "ESCOLAS ENSINO MÉDIO", industryType: "EDUCAÇÃO (ESCOLAS)", description: "ESCOLA COM MAIOR PERCENTUAL DE ALUNOS EM ENSINO MÉDIO" },
  { id: "LANCHONETE", industryType: "EDUCAÇÃO (ESCOLAS)", description: "ESCOLA DE OFERECIMENTO DE CURSOS" },
  { id: "HOTEL", industryType: "HOTELARIA / CLUBES / LAZER", description: "PRINCIPAL ATIVIDADE HOTEL" },
  { id: "MOTEL", industryType: "HOTELARIA / CLUBES / LAZER", description: "PRINCIPAL ATIVIDADE MOTEL / DRIVE" },
  { id: "OUTRAS HOTELARIAS", industryType: "HOTELARIA / CLUBES / LAZER", description: "OUTRAS HOTELARIAS (SPA OU CAMPING)" },
  { id: "PARQUES / OUTRAS RECREAÇÕES", industryType: "HOTELARIA / CLUBES / LAZER", description: "PRINCIPAL ATIVIDADE DE LAZER (PESQUEIROS, FAZENDAS E TURISMO)" },
  { id: "CLUBE", industryType: "HOTELARIA / CLUBES / LAZER", description: "PRINCIPAL ATIVIDADE CLUBE DE CAMPO DE SINDICATO" },
  { id: "CENTRO ESPORTIVO", industryType: "HOTELARIA / CLUBES / LAZER", description: "PRINCIPAL ATIVIDADE QUADRA E CENTRO ESPORTIVO" },
  { id: "CINEMA", industryType: "HOTELARIA / CLUBES / LAZER", description: "PRINCIPAL ATIVIDADE LANCHONETE DENTRO DO CINEMA" },
  { id: "AÇOUGUE / AVÍCOLA", industryType: "LOJA DE ALIMENTOS OU DEPARTAMENTOS", description: "PRINCIPAL ATVIDADE VENDAS DE CARNES (ACOUGUE)" },
  {
    id: "LOJAS DE ALIMENTOS ESPECÍFICOS",
    industryType: "LOJA DE ALIMENTOS OU DEPARTAMENTOS",
    description: "PRINCIPAL ATIVIDADE LOJAS DE ALIMENTOS ESPECÍFICOS (DISTRIBUIDORA DE DOCES, HORTIFRUT, EMPÓRIO OU OUTROS)",
  },
  {
    id: "LOJA DE DEPARTAMENTOS",
    industryType: "LOJA DE ALIMENTOS OU DEPARTAMENTOS",
    description: "PRINCIPAL ATIVIDADE DE DEPARTAMENTOS (ROUPAS, CALÇADOS, ITENS PARA CASA E OUTROS)",
  },
  { id: "ACADEMIA DE GINÁSTICA", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE ACADEMIA DE GINÁSTICA" },
  { id: "BUFFET", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE BUFFET PARA FESTAS" },
  { id: "BARRACA", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE BARRACAS, FEIRANTES E AMBULANTES EM GERAL" },
  { id: "OUTROS SERVIÇOS AUTO ", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE SERVIÇOS AUTOMOTIVOS" },
  { id: "DIVERSÕES ELETRÔNICAS", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE ATENDIMENTO LAN HOUSE E LOJA DE INFORMATICA" },
  { id: "BANCA DE JORNAIS", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE VENDA DE JORNAL E REVISTAS (BANCA DE JORNAIS)" },
  { id: "CABELEREIRO / SALÃO DE BELEZA", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE SALÃO DE BELEZA E BARBERARIA" },
  { id: "VIDEO LOCADORA", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE ALUGUEL DE FILMES (VIDEO LOCADORA)" },
  {
    id: "OUTRAS LOJAS DE MERCADORIAS DIVERSAS",
    industryType: "OUTROS",
    description: "PRINCIPAL ATIVIDADE LOJAS DE VARIADADES (LOJA DE 1 REAL, PRESENTES, MATERIAL DE CONSTRUÇÃO E OUTROS)",
  },
  { id: "DROGARIA/FARMACIA", industryType: "OUTROS", description: "PRINCIPAL ATIVIDADE DROGARIA/FARMACIA" },
];

export interface BusinessKey {
  key: string;
  description: string;
}
export const KEYS = [
  { key: "011", description: "DEPÓSITO DE BEBIDAS" },
  { key: "033", description: "CINEMA" },
  { key: "034", description: "CENTRO ESPORTIVO" },
  { key: "037", description: "LOJAS DE ALIMENTOS ESPECÍFICOS" },
  { key: "039", description: "MERCEARIA" },
  { key: "107", description: "AÇOUGUE / AVÍCOLA" },
  { key: "108", description: "PADARIA" },
  { key: "123", description: "LOJA DE DEPARTAMENTOS" },
  { key: "135", description: "CABELEREIRO / SALÃO DE BELEZA" },
  { key: "141", description: "VIDEO LOCADORA" },
  { key: "144", description: "BANCA DE JORNAIS" },
  { key: "147", description: "FAST-FOOD" },
  { key: "154", description: "QUIOSQUE" },
  { key: "157", description: "BOATE/DISCOTECA/BALADA" },
  { key: "158", description: "CHOPERIA / BAR NOTURNO" },
  { key: "164", description: "LANCHONETE" },
  { key: "166", description: "*SORVETERIA" },
  { key: "167", description: "SELF-SERVICE" },
  { key: "168", description: "PARQUES / OUTRAS RECREAÇÕES" },
  { key: "172", description: "DIVERSÕES ELETRÔNICAS" },
  { key: "179", description: "CLUBE" },
  { key: "195", description: "TERMINAL RODOVIÁRIO" },
  { key: "229", description: "HOSPITAL" },
  { key: "243", description: "BUFFET" },
  { key: "501", description: "SUPERMERCADO 5 A 9 CHKS" },
  { key: "502", description: "SUPERMERCADO 10 A 19 CHKS" },
  { key: "505", description: "LOJA DE CONVENIÊNCIA" },
  { key: "510", description: "OUTRAS LOJAS DE MERCADORIAS DIVERSAS" },
  { key: "132", description: "DROGARIA/FARMACIA" },
  { key: "518", description: "POSTO DE GASOLINA" },
  { key: "522", description: "OUTROS SERVIÇOS AUTO" },
  { key: "525", description: "RESTAURANTE" },
  { key: "526", description: "CHURRASCARIA" },
  { key: "527", description: "PIZZARIA" },
  { key: "530", description: "BARRACA" },
  { key: "531", description: "TRAILER" },
  { key: "534", description: "BAR" },
  { key: "536", description: "CAFETERIA / DOCERIA" },
  { key: "540", description: "ACADEMIA DE GINÁSTICA" },
  { key: "550", description: "HOTEL" },
  { key: "552", description: "MOTEL" },
  { key: "554", description: "OUTRAS HOTELARIAS" },
  { key: "564", description: "RESTAURANTE / REFEITÓRIO" },
  { key: "578", description: "AS 2 CHKS" },
  { key: "579", description: "DELIVERY" },
  { key: "581", description: "ESCOLAS ENSINO FUNDAMENTAL" },
  { key: "583", description: "ESCOLAS ENSINO MÉDIO" },
  { key: "588", description: "ADEGA" },
  { key: "589", description: "AS 1 CHKS" },
  { key: "590", description: "POSTOS DE ESTRADA" },
  { key: "592", description: "SHOPPING - RESTAURANTE" },
  { key: "593", description: "SHOPPING - LANCHONETE" },
  { key: "594", description: "PADARIA MULTIOCASIÃO" },
];

export interface Week {
  day: WeekDay;
  label: string;
  checked: boolean;
}
export const WEEK_DAYS: Week[] = [
  {
    day: "MON",
    label: "Segunda-feira",
    checked: false,
  },
  {
    day: "TUE",
    label: "Terça-feira",
    checked: false,
  },
  {
    day: "WED",
    label: "Quarta-feira",
    checked: false,
  },
  {
    day: "THU",
    label: "Quinta-feira",
    checked: false,
  },
  {
    day: "FRI",
    label: "Sexta-feira",
    checked: false,
  },
  {
    day: "SAT",
    label: "Sábado",
    checked: false,
  },
  {
    day: "SUN",
    label: "Domingo",
    checked: false,
  },
];

export interface ShiftType {
  shift: Shift;
  label: string;
  checked: boolean;
}
export const SHIFTS: ShiftType[] = [
  {
    shift: "MORNING",
    label: "Manhã (8h às 12h)",
    checked: false,
  },
  {
    shift: "AFTERNOON",
    label: "Tarde (13h às 18h)",
    checked: false,
  },
  {
    shift: "EVENING",
    label: "Noite (19h às 22h)",
    checked: false,
  },
];
