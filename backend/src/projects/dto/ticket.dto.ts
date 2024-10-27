import { UserDto } from 'src/users/dto/user.dto';
import { TicketStatus } from '../models/ticket-status';
import { SmallBoardDto } from './small-board.dto';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class TicketDto {
  id: number;
  position: number;
  ticketId: number;
  slug: string;

  @IsString()
  @MinLength(2)
  title: string;
  description: string;
  type: string;

  @IsString()
  @IsEnum(TicketStatus)
  status: TicketStatus;
  board: SmallBoardDto | null;
  creator: UserDto | null;
  assignee: UserDto | null;
  createdAt: number;
  updatedAt: number;
  closedAt: number | null;
}
