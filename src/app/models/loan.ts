export interface Loan {
  totalCreditAmount: number;
  consumedCreditAmount: number;
  firstDueDate: string;
  status: boolean;
  requestedCreditHistory: RequestedCredit[];
}

export interface RequestedCredit {
  creditId: string;
  creditRequestDate: string;
  requestedCreditValue: number;
  status: string;
  bankSlips: any[];
  loan: LoanDetails;
}

export interface LoanDetails {
  orderedAmount: number;
  monthlyFeePercentage: number;
  monthlyCetPercentage: number;
  monthlyFTTPercentage: number;
  totalAmount: number;
  installments: number;
  firstDueDate: string;
  parcelValue: number;
}
