import { Controller, Get } from '@nestjs/common';
import { UrlService } from './shared/urlservice';
import { UserService } from './users/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly urlService: UrlService,
  ) {}

  @Get('api/v3/app')
  async getApp() {
    const user = this.userService.user;
    return {
      allowed: true,
      icon: `${this.urlService.getBackendUrl()}${user.avatar}`,
    };
  }
}
