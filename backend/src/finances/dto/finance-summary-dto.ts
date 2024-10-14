export class FinanceSummaryDto {
  byTag: FinanceTagEntryDto[];
  incoming: number[];
  expenses: number[];
  balance: number[];
}

export class FinanceTagEntryDto {
  id: number;
  name: string;
  total: number;
  average: number;
  byMonth: number[];
}
