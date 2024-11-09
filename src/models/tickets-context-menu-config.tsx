import { Board } from "./board-structure";
import { AccountEntry } from "./finances/account-entry";
import { Ticket } from "./ticket";

export type TicketsContextMenuConfig = {
  top: number;
  left: number;
  show: boolean;
  value: Ticket | AccountEntry | null;
  board?: Board;
};
