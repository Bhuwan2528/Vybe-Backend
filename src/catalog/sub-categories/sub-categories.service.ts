import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/craeteSubCategory.dto.js';
import { UpdateSubCategoryDto } from './dto/updateSubCategory.dto.js';
import { PrismaService } from '../../common/prisma/prisma.service.js';

@Injectable()
export class SubCategoriesService {

    constructor(private prisma: PrismaService){}

    getAll(){
        return this.prisma.subCategory.findMany({
            where:{
                isActive: true
            }
        })
    }

    async create(data: CreateSubCategoryDto) {
        const category = await this.prisma.category.findUnique({
            where: { id: data.categoryId }
        });

        if (!category || !category.isActive) {
            throw new NotFoundException('Category not found');
        }

        return this.prisma.subCategory.create({ data });
    }

    async getById(id: number){
        const subCategory = await this.prisma.subCategory.findUnique({
            where: {
                id
            }
        })

        if(!subCategory || !subCategory.isActive){
            throw new NotFoundException('SubCategory Not found')
        }

        return subCategory;
    }

    async update(id: number, data: UpdateSubCategoryDto){
        await this.getById(id)
        return this.prisma.subCategory.update({
            where: {
                id
            }, 
            data
        })
    }

    async delete(id: number){
        await this.getById(id)
        return this.prisma.subCategory.update({
            where:{ id },
            data:{
                isActive: false
            }
        })
    }

    async getProductsBySubcategory( subCategoryId: number){
        await this.getById(subCategoryId)
        return this.prisma.product.findMany({
            where:{ 
                subCategoryId,
                isActive: true
            }
        })
    }
    
}
