import { Op } from "sequelize";
import { AccountEntryDTO } from "../dtos/finances/account-entry-dto.js";
import { AccountEntry } from "../models/finances/account-entry.js";
import { Account } from "../models/finances/account.js";
import Transformer from "../utils/Transformer.js";
import UserService from "./UserService.js";

export class SQLFinanceService {
  static shared = new SQLFinanceService();
  private userService = UserService.shared;
  private constructor() {}

  async createAccountEntry(
    accountEntry: AccountEntryDTO
  ): Promise<AccountEntryDTO> {
    const user = await this.userService.getUser();
    // todo: get project id from user
    const projectId = 3;

    const createdAccountEntry = await AccountEntry.create({
      ...accountEntry,
      creator_id: user.id,
      account_id: projectId,
      tag_id: accountEntry.tagId,
      purchasedAt: accountEntry.purchasedAt + 4 * 60 * 60,
    });
    // refresh account balance
    const account = await Account.findByPk(projectId);
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

    // refresh account balance
    const existingEntry = await AccountEntry.findByPk(id);
    if (!existingEntry) {
      throw new Error("Entry not found");
    }
    if (existingEntry.creator_id !== user.id) {
      throw new Error("You can't update this entry");
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

  async getAllEntries(year: number): Promise<AccountEntry[]> {
    const user = await this.userService.getUser();

    // find all entries, so that their unix timestamp (purchaseAt) is between the start and end of the year
    const startOfYear =
      new Date(year, 0, 1).getTime() / 1000;
    const endOfYear =
      new Date(year, 11, 31, 23, 59, 59).getTime() / 1000;

    return await AccountEntry.findAll({
      where: {
        creator_id: user.id,
        purchasedAt: {
          [Op.gte]: startOfYear,
          [Op.lte]: endOfYear,
        },
      },
      order: [
        ["purchasedAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }
}
