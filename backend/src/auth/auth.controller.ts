import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard, Public } from "./auth.guard";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("api/v3")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() auth: AuthDto) {
    return this.authService.signIn(auth);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("register")
  register(@Body(new ValidationPipe()) auth: AuthDto) {
    if (auth.password !== auth.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }
    return this.authService.register(auth);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile() {
    return "yo.";
  }
}
