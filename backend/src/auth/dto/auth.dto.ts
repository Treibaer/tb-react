import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty({message: "Confirm password is required"})
  confirmPassword?: string;
  
  @IsNotEmpty({message: "Client is required"})
  client: string;
}
