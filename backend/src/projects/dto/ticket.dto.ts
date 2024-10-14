import { UserDto } from 'src/users/dto/user.dto';
import { TicketStatus } from '../models/ticket-status';
import { SmallBoardDto } from './small-board.dto';

export class TicketDto {
  id: number;
  position: number;
  ticketId: number;
  slug: string;
  title: string;
  description: string;
  type: string;
  status: TicketStatus;
  board: SmallBoardDto | null;
  creator: UserDto | null;
  assignee: UserDto | null;
  createdAt: number;
  updatedAt: number;
}
