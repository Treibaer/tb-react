import { PasswordEntryDTO } from "../dtos/passwords/password-entry-dto.js";
import { PasswordEnvironmentDTO } from "../dtos/passwords/password-environment-dto.js";
import { PasswordEntryHistory } from "../models/passwords/password-entry-history.js";
import { PasswordEntry } from "../models/passwords/password-entry.js";
import { PasswordEnvironment } from "../models/passwords/password-environment.js";
import Transformer from "../utils/Transformer.js";
import UserService from "./UserService.js";

export class SQLPasswordService {
  static shared = new SQLPasswordService();
  private userService = UserService.shared;
  private constructor() {}

  async createEnvironment(
    environment: PasswordEnvironmentDTO
  ): Promise<PasswordEnvironmentDTO> {
    const user = await this.userService.getUser();
    const createdEntry = await PasswordEnvironment.create({
      ...environment,
      creator_id: user.id,
    });
    return Transformer.passwordEnvironment(createdEntry);
  }

  async createEntry(
    environmentId: number,
    entry: PasswordEntryDTO
  ): Promise<PasswordEntryDTO> {
    const user = await this.userService.getUser();
    const createdEntry = await PasswordEntry.create({
      ...entry,
      creator_id: user.id,
      environment_id: environmentId,
    });
    await PasswordEntryHistory.create({
      ...entry,
      entry_id: createdEntry.id,
    });
    return Transformer.passwordEntry(createdEntry);
  }

  async updateEntry(
    id: number,
    entry: PasswordEntryDTO
  ): Promise<PasswordEntryDTO> {
    const user = await this.userService.getUser();

    const existingEntry = await PasswordEntry.findByPk(id);
    if (!existingEntry) {
      throw new Error("Entry not found");
    }
    if (existingEntry.creator_id !== user.id) {
      throw new Error("You can't update this entry");
    }
    if (entry.title !== undefined) {
      existingEntry.title = entry.title;
    }
    if (entry.login !== undefined) {
      existingEntry.login = entry.login;
    }
    if (entry.password !== undefined) {
      existingEntry.password = entry.password;
    }
    if (entry.url !== undefined) {
      existingEntry.url = entry.url;
    }
    if (entry.notes !== undefined) {
      existingEntry.notes = entry.notes;
    }
    await existingEntry.save();
    await PasswordEntryHistory.create({
      ...entry,
      entry_id: id,
      id: undefined,
    });
    return Transformer.passwordEntry(existingEntry);
  }

  async getAllEntries(environmentId: number): Promise<PasswordEntry[]> {
    const user = await this.userService.getUser();

    return await PasswordEntry.findAll({
      where: {
        environment_id: environmentId,
        creator_id: user.id,
      },
      order: [["title", "ASC"]],
    });
  }
}
