import { TicketStatus } from "../models/ticket-status";
import { SmallBoardDTO } from "./small-board-dto";
import { UserDTO } from "./user-dto";

export type TicketDTO = {
  id: number;
  position: number;
  ticketId: number;
  slug: string;
  title: string;
  description: string;
  type: string;
  status: TicketStatus
  board: SmallBoardDTO | null;
  creator: UserDTO | null;
  assignee: UserDTO | null;
  createdAt: number;
  updatedAt: number;
};
