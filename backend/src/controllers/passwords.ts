import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { PasswordEntryDTO } from "../dtos/passwords/password-entry-dto.js";
import { PasswordEnvironmentDTO } from "../dtos/passwords/password-environment-dto.js";
import { PasswordEnvironment } from "../models/passwords/password-environment.js";
import { SQLPasswordService } from "../services/SQLPasswordService.js";
import UserService from "../services/UserService.js";
import Transformer from "../utils/Transformer.js";

const passwordService = SQLPasswordService.shared;

export const getAllEnvironments = async (_: Request, res: Response) => {
  try {
    const user = await UserService.shared.getUser();
    const passwordEnvironments = await PasswordEnvironment.findAll({
      where: { creator_id: user.id },
    });
    const transformedEntries = await Promise.all(
      passwordEnvironments.map(
        async (entry) => await Transformer.passwordEnvironment(entry)
      )
    );
    res.status(200).json(transformedEntries);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createEnvironment = async (
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
    const createdEnvironment = await passwordService.createEnvironment(
      req.body as PasswordEnvironmentDTO
    );
    res.status(201).json(createdEnvironment);
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

export const getAllEntries = async (req: Request, res: Response) => {
  try {
    const environmentId = Number(req.params.id);
    const environment = await PasswordEnvironment.findByPk(environmentId);
    const entries = await passwordService.getAllEntries(environmentId);
    res.status(200).json({
      environment: environment,
      entries: entries,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createEntry = async (
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
    const entry = await passwordService.createEntry(
      Number(req.params.id),
      req.body as PasswordEntryDTO
    );
    res.status(201).json(entry);
  } catch (error: any) {
    return next(new Error(error.message));
  }
};

export const updateEntry = async (
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
    const entry = await passwordService.updateEntry(
      Number(req.params.entryId),
      req.body as PasswordEntryDTO
    );
    res.status(200).json(entry);
  } catch (error: any) {
    return next(new Error(error.message));
  }
};
