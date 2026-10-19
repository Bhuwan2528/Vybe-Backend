import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AiStylistService } from './ai-stylist.service.js';
import { ImageUploadInterceptor } from '../../../common/upload/image-upload.config.js';
import type { Express } from 'express';
import { AiToProductQueryConversion } from '../../utility/query-conversion.js';
import { ProductService } from '../../../catalog/product/product.service.js';

@Controller('ai-stylist')
export class AiStylistController {

    constructor(
        private styleService: AiStylistService,
        private productService: ProductService
    ){}

    
    @Post('analyze')
    @UseInterceptors(ImageUploadInterceptor)
    async analyze(
        @Body('userPrompt') userPrompt: string ,
        @UploadedFile() image: Express.Multer.File
    ){
        const query =  await this.styleService.analyze(image, userPrompt)
        const productQuery = AiToProductQueryConversion(query)

        return this.productService.getAll(productQuery)
    }
}
