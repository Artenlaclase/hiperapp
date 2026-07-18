import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBpDto {
  @IsInt()
  systolic: number;

  @IsInt()
  diastolic: number;

  @IsNotEmpty()
  measuredAt: string;

  @IsInt()
  userId: number;
}
