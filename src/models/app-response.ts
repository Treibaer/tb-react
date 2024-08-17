import { UserSettings } from "./user-settings";

export interface AppResponse {
  allowed: boolean;
  user: UserSettings;
}
