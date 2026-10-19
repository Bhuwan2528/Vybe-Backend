import { PartialType } from "@nestjs/mapped-types";
import { CreateSubCategoryDto } from "./createSubCategory.dto.js";

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto){}