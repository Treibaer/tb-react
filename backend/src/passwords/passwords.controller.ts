import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { PasswordEnvironment } from './entities/password-environment';
import { PasswordEnvironmentDto } from './dto/password-environment.dto';
import { PasswordEntry } from './entities/password-entry';
import { User } from 'src/users/entities/user.entity';
import { Encryption } from 'src/utils/Encryption';
import { PasswordEntryDto } from './dto/password-entry.dto';
import { PasswordEntryHistory } from './entities/password-entry-history';

@Controller('api/v3/passwords')
export class PasswordsController {
  constructor(private readonly usersService: UserService) {}

  @Get('environments')
  async getEnvironments() {
    const user = this.usersService.user;
    const passwordEnvironments = await PasswordEnvironment.findAll({
      where: { creator_id: user.id },
      include: [User],
    });
    const transformedEntries = await Promise.all(
      passwordEnvironments.map(
        async (entry) => await this.passwordEnvironment(entry),
      ),
    );
    return transformedEntries;
  }

  @Post('environments')
  async createEnvironment(@Body() environment: PasswordEnvironmentDto) {
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

  @Patch('environments/:id')
  async updateEnvironment(@Body() environment: PasswordEnvironmentDto) {
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

  @Get('environments/:id/entries')
  async getEntries(@Param('id') id: number) {
    const user = this.usersService.user;
    const environment = await PasswordEnvironment.findByPk(id);
    if (!environment) {
      throw new Error('Environment not found');
    }
    const passwordEntries = await PasswordEntry.findAll({
      where: {
        creator_id: user.id,
        environment_id: environment.id,
        // archived: false,
      },
      order: [['title', 'ASC']],
    });
    const transformedEntries = await Promise.all(
      passwordEntries.map(async (entry) => await this.passwordEntry(entry)),
    );
    return {
      environment,
      entries: transformedEntries,
    };
  }

  @Post('environments/:id/entries')
  async createEntry(@Param('id') id: number, @Body() entry: PasswordEntryDto) {
    const user = this.usersService.user;
    const environment = await PasswordEnvironment.findByPk(id);
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

  @Patch('environments/:id/entries/:entryId')
  async updateEntry(
    @Param('id') id: number,
    @Param('entryId') entryId: number,
    @Body() entry: PasswordEntryDto,
  ) {
    const user = this.usersService.user;

    const environment = await PasswordEnvironment.findByPk(id, {
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

  async passwordEnvironment(
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

  async passwordEntry(entry: PasswordEntry): Promise<PasswordEntryDto> {
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
