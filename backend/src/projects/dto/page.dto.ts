import { IsString, MinLength } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export class PageDto {
  id: number;

  @IsString()
  @MinLength(3)
  title: string;
  
  content: string;
  enrichedContent: string;
  icon: string;
  position: number;
  creator: UserDto;
  updator: UserDto;
  createdAt: number;
  updatedAt: number;
  parentId: number | null;
  children: PageDto[];
}
