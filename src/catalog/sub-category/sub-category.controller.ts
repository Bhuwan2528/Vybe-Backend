import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service.js';
import { CreateSubCategoryDto } from './dto/createSubCategory.dto.js';
import { UpdateSubCategoryDto } from './dto/updateSubCategory.dto.js';

@Controller('sub-category')
export class SubCategoryController {

    constructor( private subCategoryService: SubCategoryService){}

    @Get()
    getAll(
        @Query('categoryId') categoryId: number
    ){
        return this.subCategoryService.getAll(categoryId)
    }

    @Post()
    create(@Body() data: CreateSubCategoryDto){
        return this.subCategoryService.createSubCategory(data)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateSubCategoryDto
    ){
        return this.subCategoryService.update(id, data)
    }

}
