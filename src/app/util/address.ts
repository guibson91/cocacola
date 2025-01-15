import { Address, CorreiosResponse } from "../models/address";

export const addressDTO = (correiosResponse: CorreiosResponse): Address => ({
  street: correiosResponse.logradouro ? correiosResponse.logradouro : "",
  neighborhood: correiosResponse.bairro ? correiosResponse.bairro : "",
  city: correiosResponse.localidade ? correiosResponse.localidade : "",
  state: correiosResponse.uf ? correiosResponse.uf : "",
  complement: "",
  streetNumber: "",
  reference: "",
});

export const improveAddress = (address: Address): Address => {
  const currentAdr: Address = address;
  return {
    ...address,
    line1: `${currentAdr.street}, ${currentAdr.streetNumber}`,
    line2: `${currentAdr.complement}`,
    line3: `${currentAdr.city} - ${currentAdr.state}, CEP ${currentAdr.postalCode}`,
    summary: `${currentAdr.street}, ${currentAdr.streetNumber}, ${currentAdr.city} - ${currentAdr.state}, CEP ${currentAdr.postalCode}`,
  };
};
