import { IsNotEmpty } from 'class-validator';

export class CreateMedicationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  dosage: string;

  instructions?: string;
}
