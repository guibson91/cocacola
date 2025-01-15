export interface Debt {
  detbId: string;
  originalValue: number;
  financialCost: number;
  delay: number;
  dueDate: string; //dd-mm-yyyy
  feeValue: number;
  amount: number;
  debt: boolean; //debt or title

  //frotend
  selected: boolean;
}
