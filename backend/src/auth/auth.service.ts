import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "src/users/users.service";
import { AccessToken } from "./entities/access-token";
import { AuthDto } from "./dto/auth.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signIn({ email, password, client }: AuthDto) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid username or password");
    }
    return await this.createToken(user, client);
  }

  async register({ username, password, client }: AuthDto) {
    const user = await this.userService.findOne(username);
    if (user) {
      throw new ConflictException("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    return await this.createToken(newUser, client);
  }

  private async createToken(user: User, client: string) {
    // Create JWT token
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    await AccessToken.create({
      value: accessToken,
      user_id: user.id,
      client: client,
      ip: "",
      lastUsed: Math.floor(Date.now() / 1000),
      createdAt: Math.floor(Date.now() / 1000),
    });
    return { accessToken };
  }
}
