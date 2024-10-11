import { UserSettings } from "./user-settings";

export interface AppResponse {
  allowed: boolean;
  icon: string;
  user: UserSettings;
}
