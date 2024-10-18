import { User } from "./user";

export interface AssetEntry {
  id: number;
  creator: User;
  path: string;
  createdAt: number;
  versionNumber: number;
}
