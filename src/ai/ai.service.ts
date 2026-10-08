import Groq from 'groq-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly ai: Groq;

  constructor() {
    this.ai = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async smartSearch(query: string) {
    console.log('QUERY:', query);

    const response = await this.ai.chat.completions.create({
      model: 'openai/gpt-oss-20b',

      messages: [
        {
          role: 'system',
          content: `
            You are an e-commerce search query parser.

            Extract these fields:
            - category
            - color
            - minPrice
            - maxPrice
            - style

            Rules:
            - shirt -> category = "shirt"
            - t-shirt -> category = "t-shirt"
            - jeans -> category = "jeans"
            - white -> color = "white"
            - black -> color = "black"
            - under 300 -> maxPrice = 300
            - below 500 -> maxPrice = 500
            - above 500 -> minPrice = 500
            - oversized -> style = "oversized"

            If a field is not mentioned, return null.
            Do not invent values.
          `,
        },

        {
          role: 'user',
          content: query,
        },
      ],

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'product_search_filters',
          strict: true,

          schema: {
            type: 'object',

            properties: {
              category: {
                type: ['string', 'null'],
              },

              color: {
                type: ['string', 'null'],
              },

              minPrice: {
                type: ['number', 'null'],
              },

              maxPrice: {
                type: ['number', 'null'],
              },

              style: {
                type: ['string', 'null'],
              },
            },

            required: [
              'category',
              'color',
              'minPrice',
              'maxPrice',
              'style',
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error('AI returned an empty response');
    }

    return JSON.parse(text);
  }
}