import { SmallBoard } from "./board-structure";
import { Status } from "./status";
import { User } from "./user";

export interface ProjectMeta {
  users: User[];
  types: string[];
  states: Status[];
  boards: SmallBoard[];
}
