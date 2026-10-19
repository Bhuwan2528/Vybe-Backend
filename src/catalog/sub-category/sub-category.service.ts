import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { CreateSubCategoryDto } from './dto/createSubCategory.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateSubCategoryDto } from './dto/updateSubCategory.dto.js';

@Injectable()
export class SubCategoryService {

    constructor(private prisma: PrismaService){}


    async getAll(categoryId?: number){

        const where: Prisma.SubCategoryWhereInput = {};

        if(categoryId){
            const category = await this.prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            where.categoryId = categoryId
        }

        return this.prisma.subCategory.findMany({ 
            where
        })
    }

    async createSubCategory(data: CreateSubCategoryDto){
        try {

            const category = await this.prisma.category.findUnique({
                where: { id: data.categoryId }
            })
            if(!category){
                throw new NotFoundException('Category not found')
            }

            return this.prisma.subCategory.create({ data })

        } catch (error) {
            if( 
                error instanceof PrismaClientKnownRequestError && 
                error.code === 'P2002'
            ){
                throw new ConflictException('This SubCategory already exists')
            }
        }
    }

    async update(id: number, data: UpdateSubCategoryDto){
        try {

            const category = await this.prisma.category.findUnique({
                where: { id: data.categoryId }
            })
            if(!category){
                throw new NotFoundException('Category not found')
            }

            return this.prisma.subCategory.update({
                where:{
                    id: id
                },
                data
            })
            
        } catch (error) {
            if( 
                error instanceof PrismaClientKnownRequestError && 
                error.code === 'P2002'
            ){
                throw new ConflictException('This SubCategory already exists')
            } 
        }
    }
}
