import { Op } from "sequelize";
import { AccountEntryDTO } from "../dtos/finances/account-entry-dto.js";
import { AccountEntry } from "../models/finances/account-entry.js";
import { Account } from "../models/finances/account.js";
import Transformer from "../utils/Transformer.js";
import UserService from "./UserService.js";

export class FinanceService {
  static shared = new FinanceService();
  private userService = UserService.shared;
  private constructor() {}

  async createAccountEntry(
    accountEntry: AccountEntryDTO
  ): Promise<AccountEntryDTO> {
    const user = await this.userService.getUser();

    const accountId = user.id === 1 ? 3 : 0;

    const createdAccountEntry = await AccountEntry.create({
      ...accountEntry,
      creator_id: user.id,
      account_id: accountId,
      tag_id: accountEntry.tagId,
      purchasedAt: accountEntry.purchasedAt + 4 * 60 * 60,
    });
    // refresh account balance
    const account = await Account.findByPk(accountId);
    if (account) {
      account.valueInCents += createdAccountEntry.valueInCents;
      await account.save();
    }
    return Transformer.accountEntry(createdAccountEntry);
  }

  async updateAccountEntry(
    id: number,
    accountEntry: AccountEntryDTO
  ): Promise<AccountEntryDTO> {
    const user = await this.userService.getUser();

    const existingEntry = await AccountEntry.findByPk(id);
    if (!existingEntry) {
      throw new Error("Entry not found");
    }
    if (existingEntry.creator_id !== user.id) {
      throw new Error("Not authorized");
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
        throw new Error("Account not found");
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
    return Transformer.accountEntry(existingEntry);
  }

  async updateAccountBalance(valueInCents: number): Promise<void> {
    const account = await Account.findByPk(3);
    if (!account) {
      throw new Error("Account not found");
    }
    account.valueInCents = valueInCents;
    await account.save();
  }

  async getAllEntries(
    year: number,
    filter?: {
      tag_id?: number;
      dateFrom?: string;
      dateTo?: string;
      type?: string;
    }
  ): Promise<AccountEntry[]> {
    const user = await this.userService.getUser();

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
    if (filter?.type === "income") {
      moreWhere.valueInCents = {
        [Op.gt]: 0,
      };
    }
    if (filter?.type === "expenses") {
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
        ["purchasedAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }
}
