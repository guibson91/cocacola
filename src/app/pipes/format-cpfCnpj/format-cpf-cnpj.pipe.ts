import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatCpfCnpj",
})
export class FormatCpfCnpjPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) {
      return "";
    } else if (typeof value !== "string") {
      return value;
    }
    //Formato de CPF ou CNPJ
    else {
      return getFormatedCpfCnpj(value);
    }
  }
}

const getFormatedCpfCnpj = (cpfCnpj: string): string => {
  // Remove caracteres não numéricos
  cpfCnpj = cpfCnpj.replace(/\D/g, "");
  if (cpfCnpj.length === 11) {
    // Formata como CPF: XXX.XXX.XXX-XX
    return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cpfCnpj.length === 14) {
    // Formata como CNPJ: XX.XXX.XXX/XXXX-XX
    return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  } else {
    // Retorna a string original caso não corresponda ao tamanho de um CPF ou CNPJ
    return cpfCnpj;
  }
};
