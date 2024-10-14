import { UserDto } from "src/users/dto/user.dto";

export class TicketCommentDto {
  id: number;
  createdAt: number;
  content: string;
  creator: UserDto;
}
