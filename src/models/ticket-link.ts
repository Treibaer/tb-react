import { Ticket } from "./ticket";

export interface TicketLink {
  id: number
  source: Ticket;
  target: Ticket;
  type: string;
}
