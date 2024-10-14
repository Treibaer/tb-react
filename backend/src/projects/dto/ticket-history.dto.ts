import { UserDto } from "src/users/dto/user.dto";

export class TicketHistoryDto {
  createdAt: number;
  description: string;
  versionNumber: number;
  creator: UserDto;
}
