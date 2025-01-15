export type PaymentMethod = "bankSlip" | "pix" | "credit" | "debit" | "employees" | "";
export type PaymentFormSap = "X" | "C" | "Y" | "I" | "N" | "";

export interface PaymentCondition {
  financing?: Payment[];
  credit?: Payment[];
  bankSlip?: Payment[];
  debit?: Payment;
  pix?: Payment;
  employees?: Payment;
}

export interface Payment {
  blocked?: boolean;
  billingApp?: boolean;
  code?: string;
  description?: string;
  paymentMethodDescription?: string;
  paymentCondition?: string;
  fee?: number;
  paymentMethod?: PaymentMethod;
  message?: string;
  blockReason?: string;
  number?: number;
  default?: boolean;
  days?: number;
  installments?: number;
  type?: string;
  partialAmount?: number; //o valor da parcela em si (ou de um boleto isolado)
  totalAmount?: number; //total que ele vai pagar somando todas as parcelas (ou todos os boletos)
  brand?: BrandType;
  active?: boolean;
}

export type BrandType = "amex" | "diners" | "discover" | "jcb" | "mastercard" | "visa";

export interface Card {
  id: number;
  document: string;
  token: string;
  brand: string;
  lastDigits: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  holderName?: string;
}
