export const AI_STYLIST_OUTPUT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    category: {
      type: 'string',
      enum: ['topwear'],
    },
    subcategory: {
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
        ],
      },
    },
    colors: {
      type: 'array',
      items: { type: 'string' },
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
    fit: {
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
    pattern: {
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
    message: {
      type: 'string',
    },
  },
  required: [
    'category',
    'subcategory',
    'colors',
    'styles',
    'minPrice',
    'maxPrice',
    'fit',
    'pattern',
    'message',
  ],
} as const;