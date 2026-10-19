import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSubCategoryDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @Type(()=> Number)
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;
}