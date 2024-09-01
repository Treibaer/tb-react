import { AccessToken } from "../models/access-token.js";
import { User } from "../models/user.js";
import Client from "./Client.js";

export default class UserService {
  static shared = new UserService();
  static user: User | null = null;

  private constructor() {}

  async setup(authorization: string) {
    Client.token = authorization;
    UserService.user = null;
    this.users = [];
    this.users = await User.findAll();
    await this.getUser();
  }

  async getUser(): Promise<User> {
    if (
      !Client.token ||
      !Client.token.startsWith("Bearer ") ||
      !Client.token.split(" ")[1]
    ) {
      throw new Error("No token");
    }
    if (UserService.user) {
      return UserService.user;
    }
    const exactToken = Client.token.split(" ")[1];
    const token = await AccessToken.findOne({ where: { value: exactToken } });
    if (!token) {
      throw new Error("Token not found");
    }
    const user = await token.getUser();
    UserService.user = user;
    return user;
  }

  users: any[] = [];
  async getAll(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: number): Promise<any | null> {
    return this.users.find((user) => user.id === id);
  }
}
