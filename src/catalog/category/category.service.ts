import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/createCategory.dto.js';
import { UpdateCategoryDto } from './dto/updateCategory.dto.js';

@Injectable()
export class CategoryService {

    constructor(private prisma: PrismaService){}

    getAll(){
        return this.prisma.category.findMany({
            include:{
                subCategories: true
            }
        })
    }

    createCategory(data: CreateCategoryDto){
        return this.prisma.category.create({ data })
    }

    updateCategory(categoryId: number, data: UpdateCategoryDto){
        return this.prisma.category.update({
            where: {
                id: categoryId
            },
            data
        })
    }

}
