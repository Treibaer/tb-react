import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { AccountEntry } from './entities/account-entry';
import { UserService } from 'src/users/user.service';
import { AccountEntryDto } from './dto/account-entry.dto';
import { Account } from './entities/account';
import { FinanceSummaryDto } from './dto/finance-summary-dto';
import { AccountTag } from './entities/account-tag';

@Injectable()
export class FinanceService {
  constructor(private readonly usersService: UserService) {}

  async getAllEntries(
    year: number,
    filter?: {
      tag_id?: number;
      dateFrom?: string;
      dateTo?: string;
      type?: string;
    },
  ): Promise<AccountEntry[]> {
    const user = await this.usersService.user;

    // find all entries, so that their unix timestamp (purchaseAt) is between the start and end of the year
    const dateFrom = filter?.dateFrom
      ? new Date(filter.dateFrom)
      : new Date(year, 0, 1);

    const dateTo = filter?.dateTo
      ? new Date(filter.dateTo).getTime() / 1000 + 4 * 3600
      : new Date(year, 11, 31, 23, 59, 59).getTime() / 1000;

    const moreWhere: any = {};
    if (filter?.tag_id) {
      moreWhere.tag_id = filter.tag_id;
    }
    if (filter?.type === 'income') {
      moreWhere.valueInCents = {
        [Op.gt]: 0,
      };
    }
    if (filter?.type === 'expenses') {
      moreWhere.valueInCents = {
        [Op.lt]: 0,
      };
    }

    return await AccountEntry.findAll({
      where: {
        ...moreWhere,
        creator_id: user.id,
        purchasedAt: {
          [Op.gte]: dateFrom.getTime() / 1000,
          [Op.lte]: dateTo,
        },
      },
      order: [
        ['purchasedAt', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async createAccountEntry(accountEntry: AccountEntryDto) {
    const user = await this.usersService.user;

    const accountId = user.id === 1 ? 3 : 0;

    const createdAccountEntry = await AccountEntry.create({
      ...accountEntry,
      creator_id: user.id,
      account_id: accountId,
      tag_id: accountEntry.tagId,
      purchasedAt: accountEntry.purchasedAt + 4 * 60 * 60,
    });
    const account = await Account.findByPk(accountId);
    if (account) {
      account.valueInCents += createdAccountEntry.valueInCents;
      await account.save();
    }
    return createdAccountEntry;
  }

  async deleteAccountEntry(id: number) {
    const user = await this.usersService.user;
    const accountEntry = await AccountEntry.findByPk(id);
    if (!accountEntry) {
      throw new Error('Entry not found');
    }
    if (accountEntry.creator_id !== user.id) {
      throw new Error('Not authorized');
    }
    await accountEntry.destroy();
  }

  async updateAccountEntry(id: number, accountEntry: AccountEntryDto) {
    const user = await this.usersService.user;

    const existingEntry = await AccountEntry.findByPk(id);
    if (!existingEntry) {
      throw new Error('Entry not found');
    }
    if (existingEntry.creator_id !== user.id) {
      throw new Error('Not authorized');
    }
    if (accountEntry.tagId !== undefined) {
      existingEntry.tag_id = accountEntry.tagId;
    }
    if (accountEntry.title !== undefined) {
      existingEntry.title = accountEntry.title;
    }
    if (accountEntry.valueInCents !== undefined) {
      const account = await Account.findByPk(existingEntry.account_id);
      if (!account) {
        throw new Error('Account not found');
      }
      account.valueInCents -= existingEntry.valueInCents;
      account.valueInCents += accountEntry.valueInCents;
      existingEntry.valueInCents = accountEntry.valueInCents;
      await account.save();
    }
    if (accountEntry.purchasedAt !== undefined) {
      existingEntry.purchasedAt = accountEntry.purchasedAt + 4 * 60 * 60;
    }
    await existingEntry.save();
    return existingEntry;
  }

  async updateAccountBalance(valueInCents: number): Promise<void> {
    const account = await Account.findByPk(3);
    if (!account) {
      throw new Error('Account not found');
    }
    account.valueInCents = valueInCents;
    await account.save();
  }

  createChartValues(balanceInCents: number, entries: AccountEntry[]): number[] {
    const m = new Date().getMonth() + 1;

    const monthlyValues = new Array(12).fill(0);
    for (const entry of entries) {
      const month = new Date(entry.purchasedAt * 1000).getMonth();
      monthlyValues[month] += entry.valueInCents;
    }
    let balanceBefore = balanceInCents;
    for (let i = m - 1; i >= 0; i--) {
      const oldValue = monthlyValues[i];
      monthlyValues[i] = balanceBefore / 100;
      balanceBefore -= oldValue;
    }
    // unset future months
    for (let i = m; i < 12; i++) {
      monthlyValues[i] = undefined;
    }
    return monthlyValues;
  }

  async getSummary(rawYear: number) {
    const year = rawYear ? Number(rawYear) : new Date().getFullYear();
    const accountEntries = await this.getAllEntries(year);

    accountEntries.filter((entry) => entry.tag_id !== 9);

    const tags = await AccountTag.findAll();

    const start = new Date(year, 0, 1).getTime();
    const end = new Date(year + 1, 0, 1).getTime();
    const filteredEntries = accountEntries.filter((entry) => {
      return (
        entry.purchasedAt * 1000 >= start &&
        entry.purchasedAt * 1000 < end &&
        entry.tag_id !== 9
      );
    });
    const summary: FinanceSummaryDto = {
      byTag: [],
      incoming: new Array(12).fill(0),
      expenses: new Array(12).fill(0),
      balance: new Array(12).fill(0),
    };

    const monthlySummary = new Array(13).fill(0);
    for (const entry of filteredEntries) {
      const month = new Date(entry.purchasedAt * 1000).getMonth();
      if (entry.valueInCents < 0) {
        monthlySummary[month] += entry.valueInCents;
        summary.expenses[month] += entry.valueInCents;
        summary.balance[month] += entry.valueInCents;
      } else {
        summary.incoming[month] += entry.valueInCents;
        summary.balance[month] += entry.valueInCents;
      }

      if (entry.tag_id === 0 || entry.valueInCents >= 0) {
        continue;
      }

      const tag = tags.find((tag) => tag.id === entry.tag_id);
      if (!tag) {
        continue;
      }
      let tagIndex = summary.byTag.findIndex((t) => t.id === tag.id);
      if (tagIndex === -1) {
        summary.byTag.push({
          id: tag.id,
          name: tag.title,
          total: entry.valueInCents,
          average: 0,
          byMonth: new Array(12).fill(0),
        });
        tagIndex = summary.byTag.length - 1;
      }
      summary.byTag[tagIndex].byMonth[month] += entry.valueInCents;
      summary.byTag[tagIndex].average += entry.valueInCents;
      summary.byTag[tagIndex].total += entry.valueInCents;
    }
    summary.byTag.forEach((tag) => {
      tag.average /= new Date().getMonth() + 1;
      tag.average = Math.floor(tag.average);
    });
    summary.byTag.sort((a, b) => a.total - b.total);
    return summary;
  }
}
