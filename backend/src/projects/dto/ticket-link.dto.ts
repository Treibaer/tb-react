import { TicketDto } from './ticket.dto';

export class TicketLinkDto {
  id: number;
  type: string;
  source: TicketDto;
  target: TicketDto;
}
