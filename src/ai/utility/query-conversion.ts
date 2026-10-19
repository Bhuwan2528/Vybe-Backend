import {
    Pattern,
    ProductColor,
    ProductFit,
    ProductStyle,
} from '@prisma/client';

import { ProductQueryDto } from '../../catalog/product/dto/products-filters-query.dto.js';
import { AiFiltersOutputDto } from '../schema/ai-filters-output.schema.js';

export function AiToProductQueryConversion(
    data: AiFiltersOutputDto
): ProductQueryDto {

    const productQuery: ProductQueryDto = {
        page: 1,
        limit: 20,

        subCategory: data.subcategories ?? undefined,

        colors: data.colors as ProductColor[],
        style: data.styles as ProductStyle[],

        minPrice: data.minPrice ?? undefined,
        maxPrice: data.maxPrice ?? undefined,

        fit: data.fits as ProductFit[],
        pattern: data.patterns as Pattern[],
    };

    return productQuery;
}