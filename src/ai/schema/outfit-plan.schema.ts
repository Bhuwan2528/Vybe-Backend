export interface OutfitPlanItemDto {
  slot:
    | 'primary_topwear'
    | 'layering_topwear'
    | 'bottomwear'
    | 'footwear'
    | 'accessory';

  subcategories: string[];
  colors: string[];
  styles: string[];

  minPrice: number | null;
  maxPrice: number | null;

  fits: string[];
  patterns: string[];

  reason: string;
}

export interface OutfitPlanOutputDto {
  outfitName: string;
  message: string;

  items: OutfitPlanItemDto[];

  stylingTips: string[];
}



export const AI_OUTFIT_PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,

  properties: {
    outfitName: {
      type: 'string',
    },

    message: {
      type: 'string',
    },

    items: {
      type: 'array',

      items: {
        type: 'object',
        additionalProperties: false,

        properties: {
          slot: {
            type: 'string',
            enum: [
              'primary_topwear',
              'layering_topwear',
              'bottomwear',
              'footwear',
              'accessory',
            ],
          },

          subcategories: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'shirt',
                'tshirt',
                'hoodie',
                'sweatshirt',
                'polo',
                'jacket',
                'overshirt',
                'jeans',
                'cargo',
                'trousers',
                'chinos',
                'shorts',
                'joggers',
                'sneakers',
                'boots',
                'loafers',
                'cap',
                'belt',
                'bag',
                'backpack',
                'watch',
                'sunglasses',
              ],
            },
          },

          colors: {
            type: 'array',
            items: {
              type: 'string',
            },
          },

          styles: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'trendy',
                'classy',
                'streetwear',
                'casual',
                'minimal',
                'aesthetic',
              ],
            },
          },

          minPrice: {
            type: ['integer', 'null'],
          },

          maxPrice: {
            type: ['integer', 'null'],
          },

          fits: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'regular',
                'relaxed',
                'oversized',
                'loosefit',
                'baggy',
                'tailored',
                'cropped',
                'athletic',
              ],
            },
          },

          patterns: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'solid',
                'printed',
                'striped',
                'checked',
                'graphic',
                'minimal',
              ],
            },
          },

          reason: {
            type: 'string',
          },
        },

        required: [
          'slot',
          'subcategories',
          'colors',
          'styles',
          'minPrice',
          'maxPrice',
          'fits',
          'patterns',
          'reason',
        ],
      },
    },

    stylingTips: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },

  required: [
    'outfitName',
    'message',
    'items',
    'stylingTips',
  ],
} as const;
