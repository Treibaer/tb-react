import { UserDto } from 'src/users/dto/user.dto';
import { TicketDto } from './ticket.dto';
import { IsString, MinLength } from 'class-validator';

export class BoardDto {
  id: number;
  projectId: number;

  @IsString()
  @MinLength(2)
  title: string;
  tickets: TicketDto[];
  creator: UserDto;
  position: number;
  isActive: boolean;
}
