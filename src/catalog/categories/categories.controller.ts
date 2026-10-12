import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/createCategoryDto.js';
import { UpdateCategoryDto } from './dto/updateCategoryDto.js';

@Controller('categories')
export class CategoriesController {

    constructor(private categoryService: CategoriesService){}

    @Get()
    getAll(){
        return this.categoryService.getAll()
    }

    @Post()
    create(
        @Body() data: CreateCategoryDto
    ){
        return this.categoryService.create(data)
    }

    @Get(':id')
    getById(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.categoryService.getById(id)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateCategoryDto
    ){
        return this.categoryService.update(id, data)
    }

    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.categoryService.delete(id)
    }

    @Get(':categoryId/subcategories')
    getSubCategories(
        @Param('categoryId', ParseIntPipe) categoryId: number
    ){
        return this.categoryService.getSubCategoriesByCategory(categoryId)
    }
}
