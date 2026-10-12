import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./createProduct.dto.js";

export class UpdateProductDto extends PartialType( CreateProductDto ){}