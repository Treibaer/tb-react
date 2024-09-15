import { PasswordEntry } from "../models/passwords/password-entry";
import { PasswordEnvironment } from "../models/passwords/password-environment";
import Client from "./Client";

export class PasswordService {
  static shared = new PasswordService();
  private client = Client.shared;
  private constructor() {}

  async getAllEnvironments() {
    return this.client.get<PasswordEnvironment[]>(`/passwords/environments`);
  }

  async getAllEntries(environmentId: number) {
    return this.client.get<{environment: PasswordEnvironment, entries: PasswordEntry[]}>(`/passwords/environments/${environmentId}/entries`);
  }

  async create(environment: PasswordEnvironment) {
    return this.client.post<PasswordEnvironment>(`/passwords/environments`, environment);
  }

  async createEntry(environmentId: number, entry: PasswordEntry) {
    return this.client.post<PasswordEnvironment>(`/passwords/environments/${environmentId}/entries`, entry);
  }

  async updateEntry(environmentId: number, entryId: number, entry: PasswordEntry) {
    return this.client.patch<PasswordEntry>(`/passwords/environments/${environmentId}/entries/${entryId}`, entry);
  }
}
