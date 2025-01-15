export interface CorreiosResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  erro?: string | boolean;
}

export interface Address {
  postalCode?: string;
  street?: string;
  streetNumber?: string;
  complement?: string;
  reference?: string;
  neighborhood?: string;
  city?: string;
  state?: string;

  //Frontend
  line1?: string;
  line2?: string;
  line3?: string;
  summary?: string;
}
