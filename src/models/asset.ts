import { AssetEntry } from "./asset-entry";
import { User } from "./user";

export interface Asset {
  id: number;
  title: string;
  description: string;
  notes: string;
  createdAt: number;
  creator: User;
  assetEntries: AssetEntry[];
}
