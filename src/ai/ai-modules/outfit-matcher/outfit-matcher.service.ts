import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { GenerateOutfitDto } from './dto/generate-outfit.dto';
import Groq from 'groq-sdk';
import { GroqProvider } from '../../providers/groq.provider';
import { ProductService } from '../../../catalog/product/product.service';
import { OUTFIT_MATCHER_PROMPT } from './prompts/outfit-matcher.prompt';
import { json } from 'body-parser';
import { AI_OUTFIT_PLAN_SCHEMA, OutfitPlanOutputDto } from '../../schema/outfit-plan.schema';
import { AiToProductQueryConversion } from '../../utility/query-conversion';
import { ProductQueryDto } from '../../../catalog/product/dto/products-filters-query.dto';

@Injectable()
export class OutfitMatcherService {

    private readonly ai: Groq
    constructor(
        private readonly prisma: PrismaService,
        private readonly groqProvider: GroqProvider,
        private readonly productService: ProductService
    ){
        this.ai = groqProvider.ai
    }

    async generateOutfit(data: GenerateOutfitDto, productId: number){

        //verifying product exists
        const baseProduct = await this.productService.getById(productId)

        // budget validation
        const baseProductPrice = baseProduct.price

        if(data.budget !== undefined && baseProductPrice === null){
            throw new BadRequestException('base product prise is unavailable')
        }
        if(data.budget !== undefined &&
            baseProductPrice !== null &&
            Number(baseProductPrice) > data.budget
        ){
            throw new BadRequestException('this prodct is out of your budget range ')
        }

        const initialRemainingBudget = (data.budget !== undefined && baseProduct !==undefined) 
        ? data.budget - Number(baseProductPrice)
        : null

        //prepare AI Input
        const input = {
            baseProduct,

            prefferences: {
                occassion: data.occasion,
                style: data.style,
                budget: data.budget,
                message: data.message
            },

            budgetContext: {
                currency: 'INR',
                remainimgBudget: initialRemainingBudget
            }
        }

        //generate otfit
        const reponse = await this.ai.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            reasoning_effort: 'medium',

            messages: [
                {
                    role: 'system',
                    content: OUTFIT_MATCHER_PROMPT
                },
                {
                    role: 'user',
                    content: JSON.stringify(input)
                }
            ],


            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'vybe_outfit_plan',
                    strict: true,
                    schema: AI_OUTFIT_PLAN_SCHEMA,
                },
            },
        });

        const content = reponse.choices[0].message?.content

        if (!content || typeof content !== 'string') {
            throw new InternalServerErrorException('AI retured an empty response')
        }

        let plan: OutfitPlanOutputDto

        try {
            plan = JSON.parse(content) as OutfitPlanOutputDto
        } catch (error) {
            throw new InternalServerErrorException('ai return an invalid json')
        }


        //match eatch ai recomendation to real product
        const userProductIds = new Set<string>([
            String(baseProduct.id)
        ])

        let remainingBudget = initialRemainingBudget;
        const recomendations = []

        for (const item of plan.items) {

            const maxPrice = remainingBudget === null
                ? item.maxPrice
                : item.maxPrice === null
                    ? remainingBudget
                    : Math.min(item.maxPrice, remainingBudget)


            const filters = {
                subcategory: item.subcategories,
                colors: item.colors,
                style: item.styles,
                minPrice: item.minPrice ?? undefined,
                maxPrice: maxPrice ?? undefined,
                fit: item.fits,
                pattern: item.patterns,
            };

            const candidates = await this.productService.getAll(filters as ProductQueryDto);
        }
    }
}
