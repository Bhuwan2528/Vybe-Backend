
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export enum OutfitOccasion {
  COLLEGE = 'college',
  DATE = 'date',
  PARTY = 'party',
  DAILY_WEAR = 'daily-wear',
  TRAVEL = 'travel',
  FORMAL = 'formal',
}

export enum OutfitStyle {
  STREETWEAR = 'streetwear',
  MINIMAL_CLASSY = 'minimal-classy',
  CASUAL = 'casual',
  TRENDY = 'trendy',
  SMART_CASUAL = 'smart-casual',
  AESTHETIC = 'aesthetic',
}

export class GenerateOutfitDto {
  @IsEnum(OutfitOccasion)
  occasion!: OutfitOccasion;

  @IsEnum(OutfitStyle)
  style!: OutfitStyle;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  budget?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
