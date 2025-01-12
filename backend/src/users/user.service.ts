import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UrlService } from 'src/shared/urlservice';

@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly urlService: UrlService,
  ) {}

  get user() {
    return this.request.user;
  }

  async findOne(email: string): Promise<User | undefined> {
    return await User.findOne({ where: { email } });
  }

  transform(user: User): UserDto {
    const avatar = user.avatar.startsWith('http')
      ? user.avatar
      : `${this.urlService.getBackendUrl()}${user.avatar}`;
    return {
      id: user.id,
      firstName: user.firstName,
      avatar: avatar,
    };
  }
}
