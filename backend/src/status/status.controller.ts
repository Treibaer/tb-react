import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('api/v3/status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async getStatus() {
    return await this.statusService.getLiveStatus();
  }
}
