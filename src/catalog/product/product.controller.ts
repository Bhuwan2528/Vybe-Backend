import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductQueryDto } from './dto/products-filters-query.dto.js';
import { CreateProductDto } from './dto/createProductDto.js';
import { UpdateProductDto } from './dto/updateProductDto.js';

@Controller('product')
export class ProductController {

    constructor(private productService: ProductService){}

    @Get()
    getAll(
        @Query() query: ProductQueryDto
    ){
        return this.productService.getAll(query)
    }

    @Post('create')
    create(
        @Body() data: CreateProductDto
    ){
        return this.productService.create(data)
    }

    @Patch('update/:id')
    update(
        @Param('id', ParseIntPipe ) id: number,
        @Body() data: UpdateProductDto
    ){
        return this.productService.update(id, data)
    }

    @Delete('delete/:id')
    delete(
        @Param('id', ParseIntPipe ) id: number,
        @Body() data: UpdateProductDto
    ){
        return this.productService.delete(id)
    }
}
