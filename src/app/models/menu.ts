export interface Menu {
  id?:
    | "order"
    | "menu-financial"
    | "config"
    | "help"
    | "my-business"
    | "credit-limit"
    | "loan-historic"
    | "payment"
    | "my-cards"
    | "invoice"
    | "payment-slip"
    | "loaned-asset"
    | "config-alerts"
    | "combo"
    | "logout"
    | "qrcode"
    | "remove-account"
    | "remove-client";
  label: string;
  description: string;
  image?: string;
  shortcut?: boolean;
}

export const mainMenu: Menu[] = [
  {
    id: "order",
    label: "Meus pedidos",
    description: "Verifique o status do seu pedido.",
    image: "assets/svgs/meus-pedidos.svg",
    shortcut: false,
  },
  {
    id: "menu-financial",
    label: "Financeiro",
    description: "Segunda via de boleto, limite de crédito e muito mais.",
    image: "assets/svgs/financeiro.svg",
    shortcut: true,
  },
  {
    id: "config",
    label: "Configuração de Conta",
    description: "Gerencie seus dados pessoais.",
    image: "assets/svgs/config.svg",
    shortcut: false,
  },
  {
    id: "help",
    label: "Ajuda e Suporte",
    description: "Obtenha ajuda do nosso time especializado.",
    image: "assets/svgs/suporte.svg",
    shortcut: true,
  },
  {
    id: "my-business",
    label: "Meu Negócio",
    description: "Gerencie os dados da sua empresa, como seus ativos, disponibilidade de visitas e mais.",
    image: "assets/svgs/meu-negocio.svg",
    shortcut: true,
  },
  {
    id: "logout",
    label: "Sair",
    description: "Para sair do aplicativo clique aqui.",
    image: "assets/svgs/logout.svg",
    shortcut: false,
  },
];

export const financialMenu: Menu[] = [
  {
    id: "credit-limit",
    label: "Limite de crédito",
    description: "Veja aqui seu limite de crédito",
    image: "assets/svgs/financial.svg",
  },
  {
    id: "qrcode",
    label: "Ler QR Code",
    description: "Abra o QR Code para pagamentos",
    image: "assets/svgs/qrcode.svg",
  },
  {
    id: "loan-historic",
    label: "Histórico de financiamento",
    description: "Veja aqui seus financiamentos passados",
    image: "assets/svgs/financial.svg",
  },
  {
    id: "my-cards",
    label: "Meus cartões",
    description: "Adicione/altere seus cartões de crédito",
    image: "assets/svgs/payment.svg",
  },
  // {
  //   id: 'invoice',
  //   label: 'Solicitar NFs',
  //   description: 'Solicite aqui suas NFs',
  //   image: 'assets/svgs/paper.svg',
  // },
  {
    id: "payment-slip",
    label: "Segunda via Boleto",
    description: "Emita aqui a segunda via do boleto",
    image: "assets/svgs/document2.svg",
  },
  {
    id: "payment",
    label: "Pagamentos",
    description: "Veja todos os débitos em aberto",
    image: "assets/svgs/payment.svg",
  },
  {
    id: "help",
    label: "Ajuda e Suporte",
    description: "Perguntas frequentes, abrir chamado, etc",
    image: "assets/svgs/faq-black.svg",
  },
];

export const menuConfig: Menu[] = [
  {
    id: "my-cards",
    label: "Meus cartões",
    description: "Gerencie seus cartões",
    image: "assets/svgs/payment.svg",
  },
  {
    id: "help",
    label: "Ajuda e Suporte",
    description: "Tire suas dúvidas conosco",
    image: "assets/svgs/suporte.svg",
  },
  {
    id: "config-alerts",
    label: "Alertas e mensagens",
    description: "Configure suas notificações",
    image: "assets/svgs/email.svg",
  },
  {
    id: "remove-account",
    label: "Excluir conta Orbitta",
    description: "Clicando aqui você excluirá sua conta Orbitta",
    image: "assets/svgs/trash.svg",
  },
  {
    id: "remove-client",
    label: "Excluir cadastro",
    description: "Clicando aqui você excluirá seu cadastro junto à Sorocaba Refrescos",
    image: "assets/svgs/trash.svg",
  },
];

export const menuBusiness: Menu[] = [
  {
    id: "menu-financial",
    label: "Financeiro",
    description: "Veja seus cartões, financiamento, etc.",
    image: "assets/svgs/financeiro.svg",
    shortcut: true,
  },
  {
    id: "order",
    label: "Meus pedidos",
    description: "Veja os últimos pedidos",
    image: "assets/svgs/meus-pedidos.svg",
    shortcut: false,
  },
  {
    id: "help",
    label: "Ajuda e Suporte",
    description: "Perguntas frequentes, abrir chamado, etc",
    image: "assets/svgs/suporte.svg",
    shortcut: true,
  },
  {
    id: "combo",
    label: "Monte seu combo",
    description: "Monte os seus materiais de promoção",
    image: "assets/svgs/combo.svg",
    shortcut: false,
  },
  {
    id: "loaned-asset",
    label: "Ativos comodatos",
    description: "Alugue materiais para seu evento",
    image: "assets/svgs/ativo-comodato.svg",
    shortcut: false,
  },
];
