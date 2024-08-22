import { SmallBoard } from "./board-structure";
import { User } from "./user";

export interface ProjectMeta {
  users: User[];
  types: string[];
  states: string[];
  boards: SmallBoard[];
}
