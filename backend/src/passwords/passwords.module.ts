import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from 'src/users/users.service';
import { PasswordsController } from './passwords.controller';

@Module({
  imports: [SharedModule],
  controllers: [PasswordsController],
  providers: [UsersService],
})
export class PasswordsModule {}
