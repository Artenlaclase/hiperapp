import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFoodLogDto {
  @IsInt()
  foodId: number;

  @IsNotEmpty()
  portion: string;

  @IsNotEmpty()
  consumedAt: string;

  @IsInt()
  userId: number;
}
