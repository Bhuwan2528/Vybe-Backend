import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/createCategory.dto.js';
import { UpdateCategoryDto } from './dto/updateCategory.dto.js';

@Controller('category')
export class CategoryController {

    constructor( private categoryService: CategoryService){}

    @Get()
    getAll(){
        return this.categoryService.getAll()
    }

    @Post()
    create(@Body() data: CreateCategoryDto){
        return this.categoryService.createCategory(data)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateCategoryDto
    ){
        return this.categoryService.updateCategory(id, data)
    }
}
