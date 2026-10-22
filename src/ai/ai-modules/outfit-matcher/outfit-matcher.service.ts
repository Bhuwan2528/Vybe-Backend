
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import Groq from 'groq-sdk';

import { GroqProvider } from '../../providers/groq.provider';
import { ProductService } from '../../../catalog/product/product.service';
import { GenerateOutfitDto } from './dto/generate-outfit.dto';
import { OUTFIT_MATCHER_PROMPT } from './prompts/outfit-matcher.prompt';

import {
  AI_OUTFIT_PLAN_SCHEMA,
  OutfitPlanOutputDto,
  OutfitPlanSlot,
} from '../../schema/outfit-plan.schema';

import { ProductQueryDto } from '../../../catalog/product/dto/products-filters-query.dto';

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
    data: GenerateOutfitDto,
    productId: number,
  ) {
    // 1. Fetch the selected product.
    const baseProduct =
      await this.productService.getById(productId);

    if (!baseProduct) {
      throw new NotFoundException('Product not found');
    }

    // 2. Validate the base product price.
    const rawBasePrice =
      baseProduct.price == null
        ? null
        : Number(baseProduct.price);

    const baseProductPrice =
      rawBasePrice !== null &&
      Number.isFinite(rawBasePrice) &&
      rawBasePrice >= 0
        ? rawBasePrice
        : null;

    // Calculate the budget remaining after the base product.
    let initialRemainingBudget: number | null = null;

    if (data.budget !== undefined) {
      if (baseProductPrice === null) {
        throw new BadRequestException(
          'Base product price is unavailable',
        );
      }

      if (baseProductPrice > data.budget) {
        throw new BadRequestException(
          'Selected product exceeds your outfit budget',
        );
      }

      initialRemainingBudget =
        data.budget - baseProductPrice;
    }

    // 3. Send the product and preferences to the AI.
    const input = {
      baseProduct,

      preferences: {
        occasion: data.occasion,
        style: data.style,
        budget: data.budget ?? null,
        message: data.message?.trim() || null,
      },

      budgetContext: {
        currency: 'INR',
        baseProductPrice,
        remainingBudget: initialRemainingBudget,
      },
    };

    // 4. Generate the outfit plan.
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
        'AI returned an empty outfit response',
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

    // 5. Prepare product matching.
    const usedProductIds = new Set<string>([
      String(baseProduct.id),
    ]);

    let remainingBudget = initialRemainingBudget;

    const recommendations = [];

    // Prioritize main clothing and footwear before optional items.
    const slotPriority: Record<OutfitPlanSlot, number> = {
      primary_topwear: 1,
      bottomwear: 1,
      footwear: 2,
      layering_topwear: 3,
      accessory: 4,
    };

    const outfitItems = [...plan.items].sort(
      (a, b) =>
        slotPriority[a.slot] - slotPriority[b.slot],
    );

    // 6. Match each AI recommendation with a real catalog product.
    for (const item of outfitItems) {
      const maxPrice =
        remainingBudget === null
          ? item.maxPrice
          : item.maxPrice === null
            ? remainingBudget
            : Math.min(
                item.maxPrice,
                remainingBudget,
              );

      const minPrice =
        item.minPrice !== null &&
        (maxPrice === null || item.minPrice <= maxPrice)
          ? item.minPrice
          : undefined;

      // Don't send empty arrays as active filters.
      const filters = {
        subcategory:
          item.subcategories.length > 0
            ? item.subcategories
            : undefined,

        colors:
          item.colors.length > 0
            ? item.colors
            : undefined,

        style:
          item.styles.length > 0
            ? item.styles
            : undefined,

        minPrice,

        maxPrice: maxPrice ?? undefined,

        fit:
          item.fits.length > 0
            ? item.fits
            : undefined,

        pattern:
          item.patterns.length > 0
            ? item.patterns
            : undefined,

        page: 1,
        limit: 20,
      } as ProductQueryDto;

      const candidates =
        await this.productService.getAll(filters);

      const matchedProduct = candidates.products.find(
        (product) => {
          const id = String(product.id);

          // Never recommend the base product or a duplicate.
          if (usedProductIds.has(id)) {
            return false;
          }

          // A missing price must not be treated as zero.
          if (
            product.price === null ||
            product.price === undefined
          ) {
            return false;
          }

          const price = Number(product.price);

          // Reject invalid or negative prices.
          if (
            !Number.isFinite(price) ||
            price < 0
          ) {
            return false;
          }

          // Without a budget, any valid price is acceptable.
          if (remainingBudget === null) {
            return true;
          }

          // With a budget, product must fit the remaining amount.
          return price <= remainingBudget;
        },
      );

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

    // 7. Identify recommendations without catalog matches.
    const unmatchedSlots = recommendations
      .filter((item) => item.product === null)
      .map((item) => item.slot);

    const isComplete =
      plan.items.length > 0 &&
      unmatchedSlots.length === 0;

    // 8. Calculate totals from actual selected products.
    const selectedProducts = [
      baseProduct,
      ...recommendations.flatMap((item) =>
        item.product ? [item.product] : [],
      ),
    ];

    // Number(null) would be zero, so use NaN for a missing price.
    const prices = selectedProducts.map((product) =>
      product.price == null
        ? Number.NaN
        : Number(product.price),
    );

    const allPricesKnown = prices.every(
      (price) =>
        Number.isFinite(price) && price >= 0,
    );

    // Includes the base product and all matched recommendations.
    const selectedProductsTotal = allPricesKnown
      ? prices.reduce((sum, price) => sum + price, 0)
      : null;

    // Only call it the final outfit total when the plan is complete.
    const totalPrice =
      isComplete && allPricesKnown
        ? selectedProductsTotal
        : null;

    // 9. Return the base product and actual catalog matches.
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

      budget: data.budget ?? null,
      baseProductPrice,
      selectedProductsTotal,
      totalPrice,

      remainingBudget:
        data.budget !== undefined &&
        selectedProductsTotal !== null
          ? data.budget - selectedProductsTotal
          : null,

      isComplete,
      unmatchedSlots,

      withinBudget:
        data.budget !== undefined &&
        totalPrice !== null
          ? totalPrice <= data.budget
          : null,
    };
  }
}
