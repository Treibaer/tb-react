import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Op } from "sequelize";
import { AccountEntryDTO } from "../dtos/finances/account-entry-dto.js";
import { AccountTag } from "../models/finances/account-tag.js";
import { Account } from "../models/finances/account.js";
import { SQLFinanceService } from "../services/SQLFinanceService.js";
import Transformer from "../utils/Transformer.js";
import { FinanceSummary } from "../dtos/finances/finance-summary-dto.js";

const financeService = SQLFinanceService.shared;

export const getAllEntries = async (_: Request, res: Response) => {
  try {
    const accountEntries = await financeService.getAllEntries(2024);
    const transformedEntries = await Promise.all(
      accountEntries.map(async (entry) => await Transformer.accountEntry(entry))
    );
    const tags = await AccountTag.findAll();
    const transformedTags = tags.map((tag) => Transformer.accountTag(tag));
    const balanceInCents = (await Account.findByPk(3))?.valueInCents || 0;
    res.status(200).json({
      entries: transformedEntries,
      tags: transformedTags,
      balanceInCents,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createAccountEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  try {
    const accountEntry = await financeService.createAccountEntry(
      req.body as AccountEntryDTO
    );
    res.status(201).json(accountEntry);
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

export const updateAccountEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  try {
    const accountEntry = await financeService.updateAccountEntry(
      Number(req.params.id),
      req.body as AccountEntryDTO
    );
    res.status(200).json(accountEntry);
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

export const createAccountEntryValidations = [
  body("title").isLength({ min: 2 }).withMessage("Title is too short"),
  body("valueInCents").isLength({ min: 1 }).withMessage("value is invalid"),
  // check if tag is not 0
  body("tagId").custom((value) => {
    if (value === 0) {
      throw new Error("Tag is required");
    }
    return true;
  }),
];

export const getSummary = async (req: Request, res: Response) => {
  try {
    const year = req.query.year
      ? Number(req.query.year)
      : new Date().getFullYear();
    const accountEntries = await financeService.getAllEntries(year);

    accountEntries.filter((entry) => {
      return entry.tag_id !== 9;
    });

    const tags = await AccountTag.findAll();

    // filter accountentries by year, so that their unix timestamp (purchaseAt) is between the start and end of the year
    const start = new Date(year, 0, 1).getTime();
    const end = new Date(year + 1, 0, 1).getTime();
    const filteredEntries = accountEntries.filter((entry) => {
      return (
        entry.purchasedAt * 1000 >= start &&
        entry.purchasedAt * 1000 < end &&
        entry.tag_id !== 9
      );
    });
    const summary: FinanceSummary = {
      byTag: [],
      incoming: new Array(12).fill(0),
      expenses: new Array(12).fill(0),
      balance: new Array(12).fill(0),
    };

    // iterate over all entries
    const monthlySummary = new Array(13).fill(0);
    for (const entry of filteredEntries) {
      // get the month of the entry
      const month = new Date(entry.purchasedAt * 1000).getMonth();
      // add the value of the entry to the monthly summary
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
      // tag logic
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
      } else {
        summary.byTag[tagIndex].total += entry.valueInCents;
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
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
