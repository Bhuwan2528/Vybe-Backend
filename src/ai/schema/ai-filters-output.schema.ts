export interface AiFiltersOutputDto {
  category: string | null;
  subcategories: string[];

  colors: string[];
  styles: string[];

  minPrice: number | null;
  maxPrice: number | null;

  fits: string[];
  patterns: string[];
  message: string;
}

export const AI_FILTERS_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,

  properties: {
    category: {
      type: ['string', 'null'],
      enum: ['topwear', 'bottomwear', 'footwear', 'accessories', null],
    },

    subcategories: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'shirt', 'tshirt', 'hoodie', 'sweatshirt', 'polo',
          'jacket', 'overshirt', 'jeans', 'cargo', 'trousers',
          'chinos', 'shorts', 'joggers', 'sneakers', 'boots',
          'loafers', 'cap', 'belt', 'bag', 'backpack',
          'watch', 'sunglasses',
        ],
      },
    },

    colors: {
      type: 'array',
      items: {
        type: 'string',
        // Add your supported canonical color values here.
      },
    },

    styles: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'trendy', 'classy', 'streetwear',
          'casual', 'minimal', 'aesthetic',
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
          'regular', 'relaxed', 'oversized', 'loosefit',
          'baggy', 'tailored', 'cropped', 'athletic',
        ],
      },
    },

    patterns: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'solid', 'printed', 'striped', 'checked', 'graphic',
        ],
      },
    },

    message: {
      type: 'string',
    },

  },

  required: [
    'category',
    'subcategories',
    'colors',
    'styles',
    'minPrice',
    'maxPrice',
    'fits',
    'patterns',
    'message'
  ],
} as const;