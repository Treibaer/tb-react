import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Op } from "sequelize";
import { AccountEntryDTO } from "../dtos/finances/account-entry-dto.js";
import { AccountTag } from "../models/finances/account-tag.js";
import { SQLFinanceService } from "../services/SQLFinanceService.js";
import Transformer from "../utils/Transformer.js";
import { Account } from "../models/finances/account.js";

const financeService = SQLFinanceService.shared;

export const getAllEntries = async (_: Request, res: Response) => {
  try {
    const accountEntries = await financeService.getAllEntries();
    const transformedEntries = await Promise.all(
      accountEntries.map(async (entry) => await Transformer.accountEntry(entry))
    );
    const tags = await AccountTag.findAll({
      where: {
        icon: {
          [Op.not]: "",
        },
      },
    });
    const transformedTags = tags.map((tag) => Transformer.accountTag(tag));
    const balanceInCents = (await Account.findByPk(3))?.valueInCents || 0;
    res
      .status(200)
      .json({ entries: transformedEntries, tags: transformedTags, balanceInCents });
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
      req.params.id,
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
