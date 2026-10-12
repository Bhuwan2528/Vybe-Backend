import { PartialType } from "@nestjs/mapped-types";
import { CreateProductVariantDto } from "./createProductVariant.dto.js";

export class UpdateProductVariantDto extends PartialType(CreateProductVariantDto) {

}