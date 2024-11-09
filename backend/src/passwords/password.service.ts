import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { PasswordEnvironment } from './entities/password-environment';
import { User } from 'src/users/entities/user.entity';
import { PasswordEnvironmentDto } from './dto/password-environment.dto';
import { PasswordEntry } from './entities/password-entry';
import { Encryption } from 'src/utils/Encryption';
import { PasswordEntryDto } from './dto/password-entry.dto';
import { PasswordEntryHistory } from './entities/password-entry-history';

@Injectable()
export class PasswordService {
  constructor(private readonly usersService: UserService) {}

  async fetchEnvironments() {
    const user = this.usersService.user;
    return await PasswordEnvironment.findAll({
      where: { creator_id: user.id },
      include: [User],
    });
  }

  async getTransformedEnvironments() {
    const environments = await this.fetchEnvironments();
    return await Promise.all(environments.map(this.passwordEnvironment));
  }

  async fetchEnvironment(id: number) {
    const user = this.usersService.user;
    const environment = await PasswordEnvironment.findByPk(id);
    if (!environment || environment.creator_id !== user.id) {
      throw new Error('Environment not found');
    }
    return environment;
  }

  async createEnvironment(environment: PasswordEnvironmentDto) {
    const user = this.usersService.user;
    const createdEnvironment = await PasswordEnvironment.create({
      ...environment,
      creator_id: user.id,
    });
    const fullEnvironment = await PasswordEnvironment.findByPk(
      createdEnvironment.id,
      {
        include: [User],
      },
    );
    return this.passwordEnvironment(fullEnvironment);
  }

  async updateEnvironment(environment: PasswordEnvironmentDto) {
    const user = this.usersService.user;
    const existingEnvironment = await PasswordEnvironment.findByPk(
      environment.id,
      {
        include: [User],
      },
    );
    if (!existingEnvironment) {
      throw new Error('Environment not found');
    }
    if (existingEnvironment.creator.id !== user.id) {
      throw new Error("You can't update this environment");
    }
    if (environment.title !== undefined) {
      existingEnvironment.title = environment.title;
    }
    if (environment.defaultLogin !== undefined) {
      existingEnvironment.defaultLogin = environment.defaultLogin;
    }
    await existingEnvironment.save();
    return this.passwordEnvironment(existingEnvironment);
  }

  async fetchEntries(environmentId: number) {
    const user = this.usersService.user;
    return await PasswordEntry.findAll({
      where: {
        creator_id: user.id,
        environment_id: environmentId,
        // archived: false,
      },
      order: [['title', 'ASC']],
    });
  }

  async getTransformedEntries(environmentId: number) {
    const entries = await this.fetchEntries(environmentId);
    return await Promise.all(entries.map(this.passwordEntry));
  }

  async createEntry(environmentId: number, entry: PasswordEntryDto) {
    const user = this.usersService.user;
    const environment = await PasswordEnvironment.findByPk(environmentId);
    if (!environment) {
      throw new Error('Environment not found');
    }
    if (entry.password === '') {
      throw new Error('Password is required');
    }
    // encrypt password for storage
    entry.password = Encryption.shared.encryptPassword(entry.password);
    const createdEntry = await PasswordEntry.create({
      ...entry,
      creator_id: user.id,
      environment_id: environment.id,
    });
    await PasswordEntryHistory.create({
      ...entry,
      entry_id: createdEntry.id,
    });
    return this.passwordEntry(createdEntry);
  }

  async updateEntry(
    environmentId: number,
    entryId: number,
    entry: PasswordEntryDto,
  ) {
    const user = this.usersService.user;
    const environment = await PasswordEnvironment.findByPk(environmentId, {
      include: [User],
    });
    if (!environment || environment.creator.id !== user.id) {
      throw new Error('Environment not found');
    }
    const existingEntry = await PasswordEntry.findByPk(entryId);
    if (!existingEntry) {
      throw new Error('Entry not found');
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
    if (entry.password !== undefined && entry.password !== '') {
      // encrypt password for storage and history entry
      entry.password = Encryption.shared.encryptPassword(entry.password);
      existingEntry.password = entry.password;
    }
    if (entry.url !== undefined) {
      existingEntry.url = entry.url;
    }
    if (entry.notes !== undefined) {
      existingEntry.notes = entry.notes;
    }
    if (entry.archived !== undefined) {
      existingEntry.archived = entry.archived;
    }
    await existingEntry.save();

    await PasswordEntryHistory.create({
      ...entry,
      entry_id: entryId,
      id: undefined,
    });
    return this.passwordEntry(existingEntry);
  }

  private async passwordEnvironment(
    env: PasswordEnvironment,
  ): Promise<PasswordEnvironmentDto> {
    const entries = await PasswordEntry.findAll({
      where: {
        creator_id: env.creator.id,
        environment_id: env.id,
        archived: false,
      },
    });
    return {
      id: env.id,
      title: env.title,
      defaultLogin: env.defaultLogin,
      numberOfEntries: entries.length,
    };
  }

  private async passwordEntry(entry: PasswordEntry): Promise<PasswordEntryDto> {
    return {
      id: entry.id,
      title: entry.title,
      login: entry.login,
      password: Encryption.shared.decryptPassword(entry.password),
      url: entry.url,
      notes: entry.notes,
      archived: entry.archived,
    };
  }
}
