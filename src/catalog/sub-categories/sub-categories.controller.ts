import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service.js';
import { CreateSubCategoryDto } from './dto/craeteSubCategory.dto.js';
import { UpdateSubCategoryDto } from './dto/updateSubCategory.dto.js';

@Controller('sub-categories')
export class SubCategoriesController {

    constructor( private subCategoryService: SubCategoriesService){}

    @Get()
    getAll(){
        return this.subCategoryService.getAll()
    }

    @Post()
    create( @Body() data: CreateSubCategoryDto ){
        return this.subCategoryService.create(data)
    }

    @Get(':id')
    GetById( @Param('id', ParseIntPipe) id: number ){
        return this.subCategoryService.getById(id)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateSubCategoryDto
    ){
        return this.subCategoryService.update(id, data)
    }

    @Delete(':id')
    delete( @Param('id', ParseIntPipe) id: number ){
        return this.subCategoryService.delete(id)
    }

    @Get(':subCategoryId/products')
    getProducts( @Param('subCategoryId', ParseIntPipe) subCategoryId: number ){
        return this.subCategoryService.getProductsBySubcategory(subCategoryId)
    }
}
