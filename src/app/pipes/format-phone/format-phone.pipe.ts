import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatPhone",
})
export class FormatPhonePipe implements PipeTransform {
  transform(value?: string, ...args: unknown[]): string {
    if (!value) {
      return "";
    } else if (typeof value !== "string") {
      return value;
    }
    // Formatação de telefone
    else {
      return getFormattedPhone(value);
    }
  }
}

const getFormattedPhone = (phone: string): string => {
  // Remove caracteres não numéricos
  phone = phone.replace(/\D/g, "");

  if (phone.length === 10) {
    // Formata como telefone com 8 dígitos: (XX) XXXX-XXXX
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else if (phone.length === 11) {
    // Formata como telefone com 9 dígitos: (XX) XXXXX-XXXX
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else {
    // Retorna a string original caso não corresponda ao tamanho de um telefone com 8 ou 9 dígitos
    return phone;
  }
};
