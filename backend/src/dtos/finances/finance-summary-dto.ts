export type FinanceSummary = {
  byTag: FinanceTagEntry[];
  incoming: number[];
  expenses: number[];
  balance: number[];
};

export type FinanceTagEntry = {
  id: number;
  name: string;
  total: number;
  average: number;
  byMonth: number[];
};
