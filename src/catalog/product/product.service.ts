import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service.js';
import { Pattern, Prisma, ProductColor, ProductFit, ProductStyle } from '@prisma/client';
import { ProductQueryDto } from './dto/products-filters-query.dto.js';
import { CreateProductDto } from './dto/createProductDto.js';
import { UpdateProductDto } from './dto/updateProductDto.js';

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService){}

    async getAll(query: ProductQueryDto) {
        const where: Prisma.ProductWhereInput = {
            isActive: true,
        };

        // 1. Validate price range
        if (
            query.minPrice !== undefined &&
            query.maxPrice !== undefined &&
            query.minPrice > query.maxPrice
        ) {
            throw new BadRequestException(
                'min price cannot be greater than max price',
            );
        }

        // 2. Filter by multiple subcategory IDs
        where.subCategory = {
            is: {
                name: {
                    in: query.subCategory,
                },
            },
        };
        
        // 3. Filter by multiple colors
        if (query.colors?.length) {
            where.color = {
                hasSome: query.colors,
            };
        }

        // 4. Filter by multiple styles
        if (query.style?.length) {
            where.styleTags = {
                hasSome: query.style,
            };
        }

        // 5. Filter by multiple fits
        if (query.fit?.length) {
            where.fit = {
                hasSome: query.fit,
            };
        }

        // 6. Filter by multiple patterns
        // Database mein har product ka pattern single hai.
        if (query.pattern?.length) {
            where.pattern = {
                in: query.pattern,
            };
        }

        // 7. Filter by price range
        if (
            query.minPrice !== undefined ||
            query.maxPrice !== undefined
        ) {
            where.price = {
                ...(query.minPrice !== undefined
                    ? { gte: query.minPrice }
                    : {}),
                ...(query.maxPrice !== undefined
                    ? { lte: query.maxPrice }
                    : {}),
            };
        }

        const description = query.description ?? ''

        // 9. Pagination
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        // 10. Fetch products and total matching count
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),

            this.prisma.product.count({
                where,
            }),
        ]);

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            description
        };
    }


    async create(data: CreateProductDto){

        await this.ensureSubCategoryExists(data.subCategoryId)

        const product = await this.prisma.product.create({ data })
        return product ;

    }


    async getById(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id }
        })
        if (!product) {
            throw new NotFoundException('product not found')
        }
    }


    async update(id: number, data: UpdateProductDto){

       await  this.getById(id)

        if(data.subCategoryId){
            await this.ensureSubCategoryExists(data.subCategoryId)
        }

        return await this.prisma.product.update({
            where: { id },
            data
        })

    }

    async delete(id: number){
        try {
            await this.prisma.product.delete({ where: { id } })
        } catch (error) {
            throw new BadRequestException('something went wrong')
        }
    }


    private async ensureSubCategoryExists(subCategoryId: number){
        const subCategory = await this.prisma.subCategory.findUnique({
            where: {
                id: subCategoryId
            }
        })
        if(!subCategory){
            throw new NotFoundException('sub category not found')
        }
    }
}
