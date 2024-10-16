import { IsString, MaxLength, MinLength } from "class-validator";

export class ProjectDto {
  id: number;

  @IsString()
  @MinLength(2)
  @MaxLength(2)
  slug: string;
  icon: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;
  description: string;
}
