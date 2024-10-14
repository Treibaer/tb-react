import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UrlService } from './shared/urlservice';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly urlService: UrlService,
  ) {}

  @Get('api/v3/app')
  async getApp() {
    const user = this.usersService.user;
    return { allowed: true, icon: `${this.urlService.getBackendUrl()}${user.avatar}` };
  }
}
