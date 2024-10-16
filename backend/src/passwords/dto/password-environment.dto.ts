import { IsString, MinLength } from 'class-validator';

export class PasswordEnvironmentDto {
  id: number;
  @IsString()
  @MinLength(2)
  title: string;
  defaultLogin: string;
  numberOfEntries: number;
}
