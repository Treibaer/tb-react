import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { FinanceService } from './finance.service';
import { AccountTag } from './entities/account-tag';
import { Account } from './entities/account';
import { AccountEntry } from './entities/account-entry';
import { AccountTagDto } from './dto/account-tag.dto';
import { AccountEntryDto } from './dto/account-entry.dto';
import { FinanceSummaryDto } from './dto/finance-summary-dto';

@Controller('api/v3/finances')
export class FinancesController {
  accountId = 3;

  constructor(
    private readonly usersService: UserService,
    private readonly financeService: FinanceService,
  ) {}

  @Get('entries')
  async getAllEntries(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
    @Query('tag') tag: number,
    @Query('type') type: string,
  ) {
    const accountEntries = await this.financeService.getAllEntries(2024, {
      tag_id: tag ?? undefined,
      dateFrom,
      dateTo,
      type: (type as string) ?? undefined,
    });
    const transformedEntries = await Promise.all(
      accountEntries.map(async (entry) => await this.accountEntry(entry)),
    );
    const tags = await AccountTag.findAll();
    const transformedTags = tags.map((tag) => this.accountTag(tag));
    const balanceInCents =
      (await Account.findByPk(this.accountId))?.valueInCents || 0;

    return {
      entries: transformedEntries,
      tags: transformedTags,
      balanceInCents,
    };
  }

  @Get('dashboard')
  async getDashboard() {
    const user = this.usersService.user;
    const accountEntries = await AccountEntry.findAll({
      where: { creator_id: user.id },
      order: [['purchasedAt', 'DESC']],
      limit: 10,
    });
    // find all entries of current month
    const currentMonthEntries = await this.financeService.getAllEntries(
      2024,
      {},
    );
    const currentIncomeInCents = currentMonthEntries.reduce((acc, entry) => {
      return entry.valueInCents > 0 ? acc + entry.valueInCents : acc;
    }, 0);
    const currentExpensesInCents = currentMonthEntries.reduce((acc, entry) => {
      return entry.valueInCents < 0 ? acc + entry.valueInCents : acc;
    }, 0);

    const transformedEntries = await Promise.all(
      accountEntries.map(async (entry) => await this.accountEntry(entry)),
    );
    const accountId = user.id === 1 ? 3 : 0;
    const balanceInCents =
      (await Account.findByPk(accountId))?.valueInCents || 0;

    const chartValues = this.createChartValues(
      balanceInCents,
      currentMonthEntries,
    );

    return {
      recentEntries: transformedEntries,
      currentIncomeInCents,
      currentExpensesInCents,
      balanceInCents,
      chartValues,
    };
  }

  private createChartValues(
    balanceInCents: number,
    entries: AccountEntry[],
  ): number[] {
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

  @Post('entries')
  async createAccountEntry(@Body() accountEntry: AccountEntryDto) {
    const createdEntry =
      await this.financeService.createAccountEntry(accountEntry);
    return this.accountEntry(createdEntry);
  }

  @Patch('entries/:id')
  async updateAccountEntry(
    @Body() accountEntry: AccountEntryDto,
    @Param('id') id: number,
  ) {
    const updatedEntry = await this.financeService.updateAccountEntry(
      id,
      accountEntry,
    );
    return this.accountEntry(updatedEntry);
  }

  @Patch('/')
  async updateAccount(@Body() body: { value: number }) {
    this.financeService.updateAccountBalance(body.value);
    return {};
  }

  static tags: AccountTag[] = [];

  async accountEntry(accountEntry: AccountEntry): Promise<AccountEntryDto> {
    if (!FinancesController.tags.length) {
      FinancesController.tags = await AccountTag.findAll();
    }
    const tag = FinancesController.tags.find(
      (tag) => tag.id === accountEntry.tag_id,
    );
    return {
      id: accountEntry.id,
      title: accountEntry.title,
      createdAt: accountEntry.createdAt,
      valueInCents: accountEntry.valueInCents,
      purchasedAt: accountEntry.purchasedAt,
      tagId: accountEntry.tag_id,
      icon: tag?.icon ?? '',
      tag: tag?.title ?? '',
    };
  }

  @Get("summary")
  async getSummary(
    @Query("year") rawYear: number
  ) {
    const year = rawYear
      ? Number(rawYear)
      : new Date().getFullYear();
    const accountEntries = await this.financeService.getAllEntries(year);

    accountEntries.filter((entry) => {
      return entry.tag_id !== 9;
    });

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

  accountTag(accountTag: AccountTag): AccountTagDto {
    return {
      id: accountTag.id,
      title: accountTag.title,
      icon: accountTag.icon,
    };
  }
}
