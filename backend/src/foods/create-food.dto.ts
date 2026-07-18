import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFoodDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  sodiumLevel?: string;

  @IsOptional()
  potassium?: string;

  @IsOptional()
  category?: string;
}
