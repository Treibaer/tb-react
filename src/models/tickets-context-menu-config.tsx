import { Board } from "./board-structure";
import { Ticket } from "./ticket";

export type TicketsContextMenuConfig = {
  top: number;
  left: number;
  show: boolean;
  ticket: Ticket | null;
  board?: Board;
};
