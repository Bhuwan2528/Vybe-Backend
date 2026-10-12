
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @IsInt()
  @Min(1)
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
