import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as cardValidator from "card-validator";

// Validador de data de expiração MM/AAAA
export const expirationDateValidator = (): ValidationErrors => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    const valid = regex.test(value);
    return valid ? null : { invalidDate: { value: control.value } };
  };
};

// Validador de CPF/CNPJ
export function cpfCnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return validateCPF(cleaned) ? null : { invalidCPF: { value: control.value } };
    } else if (cleaned.length === 14) {
      return validateCNPJ(cleaned) ? null : { invalidCNPJ: { value: control.value } };
    } else {
      return { invalidCPF: { value: control.value } };
    }
  };
}

export const birthdayValidator = (): ValidationErrors => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(datePattern);

    if (!match) {
      return { invalidDateFormat: true };
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    // Verificar se a data é válida
    const isValidDate = (d, m, y) => {
      return m >= 1 && m <= 12 && d > 0 && d <= new Date(y, m, 0).getDate();
    };

    if (!isValidDate(day, month, year)) {
      return { invalidDate: true };
    }

    const birthDate = new Date(year, month - 1, day);
    if (isNaN(birthDate.getTime())) {
      return { invalidDate: true };
    }

    // Checar se a data é no futuro
    const currentDate = new Date();
    if (birthDate > currentDate) {
      return { futureDate: true };
    }

    // Calcular a idade
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    // Verificar se tem menos de 18 anos
    if (age < 18) {
      return { underAge: true };
    }

    return null;
  };
};

export const periodValidator = (): ValidationErrors => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = String(value).match(datePattern);

    if (!match) {
      return { invalidDateFormat: true };
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    // Verificar se a data é válida
    const isValidDate = (d, m, y) => {
      return m >= 1 && m <= 12 && d > 0 && d <= new Date(y, m, 0).getDate();
    };

    if (!isValidDate(day, month, year)) {
      return { invalidDate: true };
    }

    const birthDate = new Date(year, month - 1, day);
    if (isNaN(birthDate.getTime())) {
      return { invalidDate: true };
    }

    // Checar se a data é no futuro
    const currentDate = new Date();
    if (birthDate > currentDate) {
      return { futureDate: true };
    }

    return null;
  };
};

export const passwordValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    // Verifica se o valor não está vazio
    if (!value) {
      return null;
    }

    // Verifica a combinação de caracteres
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);

    // Conta quantos dos critérios são verdadeiros
    const validCriteriaCount = [hasUpperCase, hasLowerCase, hasNumber].filter(Boolean).length;

    // Certifique-se de que pelo menos 2 critérios são cumpridos e o comprimento é pelo menos 8
    const isPasswordValid = validCriteriaCount >= 2;

    if (isPasswordValid) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  };
};

// Validador de comparação de senhas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get("password")?.value;
  const confirmPassword = control.get("password2")?.value;
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsDontMatch: true };
  }
  return null;
};

export const creditCardValidator = (): ValidationErrors => {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const validation = cardValidator.number(control.value);
    return validation.isValid ? null : { invalidCardNumber: { value: control.value } };
  };
};

export const fullNameValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) {
    return null;
  }
  const names = value.trim().split(/\s+/);
  if (names.length < 2) {
    return { notFullName: true };
  }
  return null;
};

export const cellphoneValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = (control.value || "").replace(/\D/g, ""); // Remove non-digits
  if (!value) {
    return null;
  }
  if (value.length === 10 || value.length === 11) {
    return null;
  }
  return { invalidCellphone: true };
};

// Função para validar o CPF
const validateCPF = (cpf: string): boolean => {
  let sum, rest;
  if (cpf == undefined || cpf.trim().length === 0 || cpf === "00000000000") return false;
  cpf = cpf.replace(/\D/g, "");

  sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

// Função para validar o CNPJ
const validateCNPJ = (cnpj: string): boolean => {
  let size, numbers, digits, sum, pos;

  if (cnpj == undefined || cnpj.trim().length === 0 || cnpj === "00000000000000") return false;

  cnpj = cnpj.replace(/[^\d]+/g, "");

  size = cnpj.length - 2;
  numbers = cnpj.substring(0, size);
  digits = cnpj.substring(size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};
