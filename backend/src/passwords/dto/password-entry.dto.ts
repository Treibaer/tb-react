import { IsString, MinLength } from "class-validator";

export class PasswordEntryDto  {
  id: number;

  @IsString()
  @MinLength(2)
  login: string;
  
  password: string;

  @IsString()
  @MinLength(2)
  title: string;
  url: string;
  notes: string;
  archived: boolean;
};
