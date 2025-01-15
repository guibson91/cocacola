import { RequestedCredit } from "./loan";

export interface Invoice {
  status?: "PAID" | "OVERDUE" | "PENDING";
  file?: string;
  client?: string;
  date?: string;
  paymentDate?: string;
  dueDate?: string;
  originalDueDate?: string;
  daysLate?: string;
  barCode?: string;
  message?: string;
  code?: string;
  invoice?: string;
  invoiceValue?: number;
  fineValue?: number;
  updatedValue?: number;
  id?: string;
  details?: RequestedCredit;
}
