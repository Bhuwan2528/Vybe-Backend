
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import Groq from 'groq-sdk';

import { GroqProvider } from '../../providers/groq.provider.js';
import { ProductService } from '../../../catalog/product.service.js';

import { GenerateOutfitDto } from './dto/generate-outfit.dto.js';

import {
  AI_OUTFIT_PLAN_SCHEMA,
  OutfitPlanOutputDto,
} from './schema/outfit-plan.schema.js';

import { OUTFIT_MATCHER_PROMPT } from './prompts/outfit-matcher.prompt.js';

@Injectable()
export class OutfitMatcherService {
  private readonly ai: Groq;

  constructor(
    private readonly groqProvider: GroqProvider,
    private readonly productService: ProductService,
  ) {
    this.ai = this.groqProvider.ai;
  }

  async generateOutfit(
    productId: string,
    dto: GenerateOutfitDto,
  ) {
    // 1. Fetch the selected product.
    const baseProduct =
      await this.productService.findOne(productId);

    if (!baseProduct) {
      throw new NotFoundException('Product not found');
    }

    const baseProductPrice = Number(baseProduct.price);

    if (
      dto.budget !== undefined &&
      !Number.isFinite(baseProductPrice)
    ) {
      throw new BadRequestException(
        'Selected product price is unavailable',
      );
    }

    if (
      dto.budget !== undefined &&
      baseProductPrice > dto.budget
    ) {
      throw new BadRequestException(
        'Selected product exceeds your outfit budget',
      );
    }

    const initialRemainingBudget =
      dto.budget === undefined
        ? null
        : dto.budget - baseProductPrice;

    // 2. Prepare the AI input.
    const input = {
      baseProduct,

      preferences: {
        occasion: dto.occasion,
        style: dto.style,
        budget: dto.budget ?? null,
        message: dto.message?.trim() || null,
      },

      budgetContext: {
        currency: 'INR',
        remainingBudget: initialRemainingBudget,
      },
    };

    // 3. Generate the outfit plan.
    const response =
      await this.ai.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        reasoning_effort: 'medium',

        messages: [
          {
            role: 'system',
            content: OUTFIT_MATCHER_PROMPT,
          },
          {
            role: 'user',
            content: JSON.stringify(input),
          },
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

    const content =
      response.choices[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      throw new InternalServerErrorException(
        'AI returned an empty response',
      );
    }

    let plan: OutfitPlanOutputDto;

    try {
      plan = JSON.parse(content) as OutfitPlanOutputDto;
    } catch {
      throw new InternalServerErrorException(
        'AI returned invalid JSON',
      );
    }

    // 4. Match each AI recommendation with a real product.
    const usedProductIds = new Set<string>([
      String(baseProduct.id),
    ]);

    let remainingBudget = initialRemainingBudget;

    const recommendations = [];

    for (const item of plan.items) {
      const maxPrice =
        remainingBudget === null                             // remainingBudget agar null hai, mtlb undefined hai user ne select hi nhi kiya 
          ? item.maxPrice                                   // ai ne jo is item ke liye max price suggest kiy hai vo rkho
          : item.maxPrice === null                          // agar AI ne bhi kuch suggest nhi kiya, null hai
            ? remainingBudget                               // remaining budget hi max value hai 
            : Math.min(item.maxPrice, remainingBudget);     //agar AI ne suggest kiya hai, to dekho ki ai yaa reminingprice me se chota konsa hai ?

      const minPrice =
        item.minPrice !== null &&
        (maxPrice === null || item.minPrice <= maxPrice)
          ? item.minPrice
          : undefined;

      const filters = {
        subcategory: item.subcategories,
        colors: item.colors,
        style: item.styles,
        minPrice,
        maxPrice: maxPrice ?? undefined,
        fit: item.fits,
        pattern: item.patterns,
        page: 1,
        limit: 20,
      };

      const candidates =
        await this.productService.findAll(filters);

      const matchedProduct = candidates.find((product) => {
        const id = String(product.id);
        const price = Number(product.price);

        return (
          !usedProductIds.has(id) &&
          (
            remainingBudget === null ||
            (
              Number.isFinite(price) &&
              price <= remainingBudget
            )
          )
        });

      if (matchedProduct) {
        usedProductIds.add(String(matchedProduct.id));

        if (remainingBudget !== null) {
          remainingBudget -= Number(matchedProduct.price);
        }
      }

      recommendations.push({
        slot: item.slot,
        reason: item.reason,
        product: matchedProduct ?? null,
      });
    }

    // 5. Calculate the actual total.
    const unmatchedSlots = recommendations
      .filter((item) => item.product === null)
      .map((item) => item.slot);

    const isComplete =
      plan.items.length > 0 &&
      unmatchedSlots.length === 0;

    const selectedProducts = [
      baseProduct,
      ...recommendations.flatMap((item) =>
        item.product ? [item.product] : [],
      ),
    ];

    const prices = selectedProducts.map(
      (product) => Number(product.price),
    );

    const allPricesKnown = prices.every(
      (price) => Number.isFinite(price) && price >= 0,
    );

    const matchedProductsTotal = allPricesKnown
      ? prices.reduce((sum, price) => sum + price, 0)
      : null;

    const totalPrice =
      isComplete && allPricesKnown
        ? matchedProductsTotal
        : null;

    return {
      productId: baseProduct.id,

      outfitName: plan.outfitName,
      message: plan.message,
      stylingTips: plan.stylingTips,

      items: [
        {
          slot: 'base_product',
          reason: 'Your selected product',
          product: baseProduct,
        },
        ...recommendations,
      ],

      budget: dto.budget ?? null,
      baseProductPrice,
      matchedProductsTotal,
      totalPrice,

      remainingBudget:
        dto.budget !== undefined && totalPrice !== null
          ? dto.budget - totalPrice
          : null,

      isComplete,
      unmatchedSlots,

      withinBudget:
        dto.budget !== undefined && totalPrice !== null
          ? totalPrice <= dto.budget
          : null,
    };
  }
}
