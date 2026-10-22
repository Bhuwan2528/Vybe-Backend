
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto.js';
import { UpdateProductDto } from './dto/updateProduct.dto.js';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        subCategory: true,
      },
    });
  }


  async create(data: CreateProductDto) {
    
    // 1. check sub category
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: data.subCategoryId },
    });

    if (!subCategory || !subCategory.isActive) {
      throw new NotFoundException('SubCategory not found');
    }

    //2. seperate products fields form variants
    const { variants, ...productData } = data;

    return this.prisma.$transaction(async (tx) => {
      //creating product
      const product = await tx.product.create({
        data: productData,
      });

      // creating stock
      await tx.productVariant.createMany({
        data: variants.map((variant) => ({
          productId: product.id,
          size: variant.size,
          stock: variant.stock,
          sku: `VYBE-${product.id}-${variant.size}-${randomUUID()}`,
        })),
      });

      //returning product with variants
      return tx.product.findUniqueOrThrow({
        where: {
          id: product.id,
        },
        include: {
          subCategory: true,
          variants: true,
        },
      });
    });
  }


  async getById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        subCategory: true,
        variants: true,
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }


    async update(id: number, data: UpdateProductDto) {

        await this.getById(id);

        const { subCategoryId, ...productData } = data;

        if (subCategoryId !== undefined) {
            const subCategory = await this.prisma.subCategory.findUnique({
                where: { id: subCategoryId },
            });

            if (!subCategory || !subCategory.isActive) {
                throw new NotFoundException('SubCategory not found');
            }
        }

        // Update only provided fields
        return this.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                ...(subCategoryId !== undefined && {
                    subCategoryId
                }),
            },
        });
    }


  async updateStock(productId: number, stockId: number, stockCount: number) {
    await this.getById(productId);

    const variant = await this.prisma.productVariant.findFirst({
      where: {
        id: stockId,
        productId,
      },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    const stock = await this.prisma.productVariant.update({
      where: {
        productId,
        id: stockId,
      },
      data: {
        stock: stockCount,
      },
    });

    return stock;
  }
  

  async delete(id: number) {
    await this.getById(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getVariants(id: number) {
    const product = await this.getById(id);
    return product.variants;
  }
}
