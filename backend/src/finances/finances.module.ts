import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from 'src/users/user.service';
import { FinancesController } from './finances.controller';
import { FinanceService } from './finance.service';

@Module({
  imports: [SharedModule],
  controllers: [FinancesController],
  providers: [FinanceService, UserService],
})
export class FinancesModule {}
