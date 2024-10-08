import { TicketDTO } from "./ticket-dto";
import { UserDTO } from "./user-dto";

export type BoardDTO = {
  id: number;
  projectId: number;
  title: string;
  tickets: TicketDTO[];
  creator: UserDTO;
  position: number;
  isActive: boolean;
};
