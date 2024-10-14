import { Module } from '@nestjs/common';
import { UrlService } from './urlservice';

@Module({
  providers: [UrlService],
  exports: [UrlService],
})
export class SharedModule {}
