export interface YearlyData {
  title?: string;
  year?: string;
  totalYear?: number;
  totalLastYear?: number;
  currentYear?: MonthData[];
  lastYear?: MonthData[];
}

export interface MonthData {
  month?: string;
  total?: number;
}
