import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  @Max(9999)
  readonly year: number;

  @IsNumber()
  @IsNotEmpty()
  readonly categoryId: number;
}
