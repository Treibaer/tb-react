import { AccountEntry } from "../models/finances/account-entry";
import { AcccountTag } from "../models/finances/account-tag";
import { FinanceSummary } from "../models/finances/finance-summary";
import Client from "./Client";

export class FinanceService {
  static shared = new FinanceService();
  private client = Client.shared;
  private constructor() {}

  async getAccountEntries(filter?: {
    tag?: number;
    dateFrom?: string;
    dateTo?: string;
    type?: string;
  }) {
    let suffix = "";
    if (filter?.tag) {
      suffix += `?tag=${filter.tag}`;
    }
    if (filter?.dateFrom) {
      suffix += suffix ? "&" : "?";
      suffix += `dateFrom=${filter.dateFrom}`;
    } else {
      suffix += suffix ? "&" : "?";
      suffix += `dateFrom=$2024-01-01`;
    }
    if (filter?.dateTo) {
      suffix += suffix ? "&" : "?";
      suffix += `dateTo=${filter.dateTo}`;
    }
    if (filter?.type) {
      suffix += suffix ? "&" : "?";
      suffix += `type=${filter.type}`;
    }
    return this.client.get<{
      entries: AccountEntry[];
      tags: AcccountTag[];
      balanceInCents: number;
    }>(`/finances/entries${suffix}`);
  }

  async getDashboardData(
  ) {
    return this.client.get<{
      recentEntries: AccountEntry[];
      currentIncomeInCents: number;
      currentExpensesInCents: number;
      balanceInCents: number;
      chartValues: number[];
    }>(`/finances/dashboard`);
  }

  async createOrUpdateEntry(
    id: number,
    title: string,
    value: number,
    purchasedAt: string,
    tagId: number
  ) {
    const entry: AccountEntry = {
      id: id,
      title,
      icon: "",
      tag: "",
      valueInCents: value * 100,
      createdAt: Math.floor(Date.now() / 1000),
      purchasedAt: Math.floor(new Date(purchasedAt).getTime() / 1000),
      tagId,
    };
    if (id && id > 0) {
      return this.client.patch(`/finances/entries/${id}`, entry);
    }
    return this.client.post("/finances/entries", entry);
  }

  async removeEntry(id: number) {
    return this.client.delete(`/finances/entries/${id}`);
  }

  async updateBalance(value: number) {
    return this.client.patch(`/finances`, { value });
  }

  async getAccountSummary(year: number) {
    return this.client.get<FinanceSummary>(`/finances/summary?year=${year}`);
  }
}
