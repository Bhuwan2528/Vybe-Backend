
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProductDto } from './dto/createProduct.dto.js';
import { UpdateProductDto } from './dto/updateProduct.dto.js';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    getAll() {
        return this.prisma.product.findMany({
            where: { isActive: true },
            include: {
                subCategory: true
            }
        });
    }

    async create(data: CreateProductDto) {
        const subCategory = await this.prisma.subCategory.findUnique({
            where: { id: data.subCategoryId }
        });

        if (!subCategory || !subCategory.isActive) {
            throw new NotFoundException('SubCategory not found');
        }

        return this.prisma.product.create({
            data
        });
    }

    async getById(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                subCategory: true,
                variants: true
            }
        });

        if (!product || !product.isActive) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: number, data: UpdateProductDto) {
        await this.getById(id);

        if (data.subCategoryId !== undefined) {
            const subCategory = await this.prisma.subCategory.findUnique({
                where: { id: data.subCategoryId }
            });

            if (!subCategory || !subCategory.isActive) {
                throw new NotFoundException('SubCategory not found');
            }
        }

        return this.prisma.product.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        await this.getById(id);

        return this.prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
    }

    async getVariants(id: number) {
        const product = await this.getById(id);
        return product.variants;
    }
}
