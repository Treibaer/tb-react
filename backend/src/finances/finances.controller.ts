import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { AccountEntryDto } from './dto/account-entry.dto';
import { AccountTagDto } from './dto/account-tag.dto';
import { Account } from './entities/account';
import { AccountEntry } from './entities/account-entry';
import { AccountTag } from './entities/account-tag';
import { FinanceService } from './finance.service';

@Controller('api/v3/finances')
export class FinancesController {
  private readonly ACCOUNT_ID = 3;

  constructor(
    private readonly usersService: UserService,
    private readonly financeService: FinanceService,
  ) {}

  /**
   * Gets all account entries within the specified date range and tag.
   * @param dateFrom - The start date for filtering entries.
   * @param dateTo - The end date for filtering entries.
   * @param tag - The tag ID for filtering entries.
   * @param type - The type of entry to filter by.
   * @returns A transformed list of account entries, tags, and balance in cents.
   */
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
      (await Account.findByPk(this.ACCOUNT_ID))?.valueInCents || 0;

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

    const chartValues = this.financeService.createChartValues(
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

  @Post('entries')
  async createAccountEntry(@Body() accountEntry: AccountEntryDto) {
    const createdEntry =
      await this.financeService.createAccountEntry(accountEntry);
    return this.accountEntry(createdEntry);
  }

  @Delete('entries/:id')
  async deleteAccountEntry(@Param('id') id: number) {
    await this.financeService.deleteAccountEntry(id);
    return {};
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

  @Get('summary')
  async getSummary(@Query('year') rawYear: number) {
    return await this.financeService.getSummary(rawYear);
  }

  accountTag(accountTag: AccountTag): AccountTagDto {
    return {
      id: accountTag.id,
      title: accountTag.title,
      icon: accountTag.icon,
    };
  }
}
