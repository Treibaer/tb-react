import { UserDto } from 'src/users/dto/user.dto';
import { TicketDto } from './ticket.dto';

export class BoardDto {
  id: number;
  projectId: number;
  title: string;
  tickets: TicketDto[];
  creator: UserDto;
  position: number;
  isActive: boolean;
}
