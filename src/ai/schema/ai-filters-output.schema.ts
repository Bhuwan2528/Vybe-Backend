export interface AiFiltersOutputDto {
  category: string | null;
  subcategory: string[];
  colors: string[];
  style: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  fit: string[];
  pattern: string[];
}


export const AI_FILTERS_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    category: {
      type: ['string', 'null'],
      enum: ['topwear', 'bottomwear', 'footwear', 'accessories', null],
    },

    subcategory: {
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
      },
    },

    style: {
      type: ['string', 'null'],
      enum: ['trendy', 'classy', 'streetwear', 'casual', 'minimal', 'aesthetic', null],
    },

    minPrice: {
      type: ['integer', 'null'],
    },

    maxPrice: {
      type: ['integer', 'null'],
    },

    fit: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'regular', 'relaxed', 'oversized', 'loosefit',
          'baggy', 'tailored', 'cropped', 'athletic',
        ],
      },
    },

    pattern: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['solid', 'printed', 'striped', 'checked', 'graphic', 'minimal'],
      },
    },
  },

  required: [
    'category',
    'subcategory',
    'colors',
    'style',
    'minPrice',
    'maxPrice',
    'fit',
    'pattern',
  ],
} as const;