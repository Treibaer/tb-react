import { AsyncLocalStorage } from "async_hooks";
import { AccessToken } from "../models/access-token.js";
import { User } from "../models/user.js";

const asyncLocalStorage = new AsyncLocalStorage();

export default class UserService {
  static shared = new UserService();
  store: any = null;

  private constructor() {}

  async setup(authorization: string) {
    await asyncLocalStorage.run(new Map<string, string | undefined>(), async () => {
      const store: any = asyncLocalStorage.getStore();
      this.store = store;
      store?.set("token", authorization);
      store?.set("user", null);
      store?.set("users", []);
      store?.set("users", await User.findAll());
      const user = await this.getUser();
      store?.set("user", user);
    });
  }

  async getUser(): Promise<User> {
    const rawToken = this.store.get("token");
    if (
      !rawToken ||
      !rawToken.startsWith("Bearer ") ||
      !rawToken.split(" ")[1]
    ) {
      throw new Error("No token");
    }
    if (this.store.get("user")) {
      return this.store.get("user");
    }
    const exactToken = rawToken.split(" ")[1];
    const token = await AccessToken.findOne({ where: { value: exactToken } });
    if (!token) {
      throw new Error("Token not found");
    }
    const user = await token.getUser();
    this.store?.set("user", user);
    return user;
  }

  async getAll(): Promise<User[]> {
    return this.store.get("users");
  }

  async getUserById(id: number): Promise<any | null> {
    if (this.store.get("users").length === 0) {
      this.store.set("users", await User.findAll());
    }
    return this.store.get("users").find((user: any) => user.id === id);
  }
}
