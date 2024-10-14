import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from 'src/users/users.service';
import { FinancesController } from './finances.controller';
import { FinancesService } from './finances.service';

@Module({
  imports: [SharedModule],
  controllers: [FinancesController],
  providers: [FinancesService, UsersService],
})
export class FinancesModule {}
