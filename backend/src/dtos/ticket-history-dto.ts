import { UserDTO } from "./user-dto";

export type TicketHistoryDTO = {
  createdAt: number;
  description: string;
  versionNumber: number;
  creator: UserDTO;
};
