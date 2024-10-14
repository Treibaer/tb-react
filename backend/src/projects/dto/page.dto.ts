import { UserDto } from 'src/users/dto/user.dto';

export class PageDto {
  id: number;
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
