import { IsInt, IsString, MinLength, Min, IsNumber } from 'class-validator';

export class AccountEntryDto {
  id: number;

  @IsString()
  @MinLength(2)
  title: string;
  createdAt: number;

  @IsNumber()
  valueInCents: number;
  purchasedAt: number;

  @IsInt()
  @Min(1)
  tagId: number;
  icon: string;
  tag: string;
}
