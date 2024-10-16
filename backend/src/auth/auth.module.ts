import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from 'src/users/user.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    SharedModule,
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
