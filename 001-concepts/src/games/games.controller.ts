import { Controller, Get, Param } from '@nestjs/common';

@Controller('games')
export class GamesController {
    private readonly games: string[] = [
        'COD',
        'BF6',
        'FIFA 24',
        'Black Ops 4',
    ];

    @Get()
    all(): string[] {
        return this.games;
    }

    @Get(':id')
    findOne(@Param('id') id: number): string {
        return this.games[id-1];
    }
}
