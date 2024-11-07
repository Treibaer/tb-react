import { SmallBoard } from "./board-structure";
import { TicketParent } from "./ticket-parent";
import { TicketStatus } from "./ticket-status";
import { User } from "./user";

export interface Ticket {
  id: number;
  position: number;
  ticketId: number;
  slug: string;
  title: string;
  description: string;
  type: string;
  status: TicketStatus;
  board: SmallBoard | null;
  creator: User | null;
  assignee: User | null;
  createdAt: number;
  updatedAt: number;
  closedAt: number | null;
  parent: TicketParent | null;
  children: Ticket[];
}
