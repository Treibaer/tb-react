import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PasswordEntryDto } from './dto/password-entry.dto';
import { PasswordEnvironmentDto } from './dto/password-environment.dto';
import { PasswordService } from './password.service';

@Controller('api/v3/passwords')
export class PasswordsController {
  constructor(
    private readonly passwordService: PasswordService,
  ) {}

  @Get('environments')
  async getEnvironments() {
    return await this.passwordService.getTransformedEnvironments();
  }

  @Post('environments')
  async createEnvironment(@Body() environment: PasswordEnvironmentDto) {
    return await this.passwordService.createEnvironment(environment);
  }

  @Patch('environments/:id')
  async updateEnvironment(@Body() environment: PasswordEnvironmentDto) {
    return await this.passwordService.updateEnvironment(environment);
  }

  @Get('environments/:id/entries')
  async getEntries(@Param('id') id: number) {
    const environment = await this.passwordService.fetchEnvironment(id);
    const entries = await this.passwordService.getTransformedEntries(
      environment.id,
    );
    return {
      environment,
      entries,
    };
  }

  @Post('environments/:id/entries')
  async createEntry(@Param('id') id: number, @Body() entry: PasswordEntryDto) {
    return await this.passwordService.createEntry(id, entry);
  }

  @Patch('environments/:id/entries/:entryId')
  async updateEntry(
    @Param('id') id: number,
    @Param('entryId') entryId: number,
    @Body() entry: PasswordEntryDto,
  ) {
    return await this.passwordService.updateEntry(id, entryId, entry);
  }
}
