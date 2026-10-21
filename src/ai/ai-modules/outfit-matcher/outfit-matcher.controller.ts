import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { OutfitMatcherService } from './outfit-matcher.service';
import { GenerateOutfitDto } from './dto/generate-outfit.dto';

@Controller('outfit-matcher')
export class OutfitMatcherController {

    constructor(private readonly outfitService: OutfitMatcherService){}

    @Post(':productId/generate')
    generateOutfit(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() data: GenerateOutfitDto
    ){
        return this.outfitService.generateOutfit(data, productId)
    }
}
