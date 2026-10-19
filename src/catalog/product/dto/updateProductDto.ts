import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./createProductDto.js";

export class UpdateProductDto extends PartialType(CreateProductDto){}