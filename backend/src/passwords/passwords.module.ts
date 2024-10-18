import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from 'src/users/user.service';
import { PasswordsController } from './passwords.controller';
import { PasswordService } from './password.service';

@Module({
  imports: [SharedModule],
  controllers: [PasswordsController],
  providers: [UserService, PasswordService],
})
export class PasswordsModule {}
