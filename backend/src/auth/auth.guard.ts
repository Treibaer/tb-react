import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { AccessToken } from './entities/access-token';
import { UserService } from 'src/users/user.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    // context.switchToHttp().getResponse().cookie('auth', "ABC", {
    //   httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    //   secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    //   maxAge: 3600000, // 1 hour expiration
    // });

    if (!token) {
      throw new UnauthorizedException();
    }

    const data = await AccessToken.findOne({
      where: { value: token },
      include: [User],
    });

    if (!data) {
      throw new UnauthorizedException();
    }

    // this.userService.user2 = data.user;
    request['user'] = data.user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
