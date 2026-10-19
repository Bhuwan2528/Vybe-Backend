import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import Groq from 'groq-sdk';
import { GroqProvider } from '../../providers/groq.provider.js';
import { AI_STYLIST_PROMPT } from './prompts/ai-stylist.prompt.js';
import { AI_STYLIST_OUTPUT_SCHEMA } from '../../schema/ai-stylist-output.schema.js';
import { AiFiltersOutputDto } from '../../schema/ai-filters-output.schema.js';

@Injectable()
export class AiStylistService {

    private readonly ai: Groq

    constructor(private groqProvider: GroqProvider){
        this.ai = groqProvider.ai
    }

    async analyze(image: Express.Multer.File, userPrompt: string){

        if(!image?.buffer?.length){
            throw new BadRequestException('A valid image is requied')
        }

        if(!userPrompt?.trim()){
            throw new BadRequestException('user prompt is required')
        }

        const base64Image = image.buffer.toString('base64')

        const imageDataUrl = `data:${image.mimetype};base64,${base64Image}`;

        const response = await this.ai.chat.completions.create({
            model: 'qwen/qwen3.8-27b',

            messages:[
                {
                    role: 'system',
                    content: AI_STYLIST_PROMPT,
                },
                {
                    role: 'user',
                    content : [
                        {
                            type: 'text',
                            text: userPrompt.trim()
                        },{
                            type: 'image_url',
                            image_url: {
                                url: imageDataUrl
                            }
                        }
                    ]
                }
            ],

            response_format :{
                type: 'json_schema',
                json_schema:{
                name: 'vybe_ai_stylist_output',
                strict: true,
                schema: AI_STYLIST_OUTPUT_SCHEMA,
                }
            }
        })


        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new InternalServerErrorException(
                'AI returned an empty response',
            );
        }

        try {
            return JSON.parse(content) as AiFiltersOutputDto;
        } catch {
            throw new InternalServerErrorException(
                'AI returned invalid JSON',
            );
        }
    }
}
