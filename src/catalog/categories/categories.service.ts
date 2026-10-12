import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/browser.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/createCategoryDto.js';
import { UpdateCategoryDto } from './dto/updateCategoryDto.js';

@Injectable()
export class CategoriesService {

    constructor(private prisma: PrismaService){}

    create(data: CreateCategoryDto){
        return this.prisma.category.create({ data })
    }

    getAll(){
        return this.prisma.category.findMany({
            where:{
                isActive: true
            }
        })
    }

    async getById(id: number) {

        const category = await this.prisma.category.findUnique({
            where: { id }
        });
        if (!category || !category.isActive) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async update(categoryId: number, data: UpdateCategoryDto){

        await this.getById(categoryId)

        return this.prisma.category.update({
            where:{ id: categoryId },
            data
        })
    }

    async delete(id: number){
        await this.getById(id)
        return this.prisma.category.update({
            where: { id },
            data:{
                isActive: false
            }
        })
    }

    async getSubCategoriesByCategory(categoryId: number){
        await this.getById(categoryId)
        return this.prisma.subCategory.findMany({
            where:{
                categoryId
            }
        })
    }
}
