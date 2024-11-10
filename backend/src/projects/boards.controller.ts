import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';

@Controller('api/v3/projects')
export class BoardsController {
  constructor(private readonly boardsService: BoardService) {}

  @Get(':slug/tickets-board-structure')
  async getBoardStructure(@Param('slug') slug: string) {
    return await this.boardsService.getBoardStructure(slug);
  }

  @Get(':slug/boards')
  async getAll(@Param('slug') slug: string) {
    return await this.boardsService.getTransformedBoards(slug);
  }

  @Post(':slug/boards')
  async create(@Param('slug') slug: string, @Body() board: BoardDto) {
    return await this.boardsService.create(slug, board);
  }

  @Get(':slug/boards/:boardId')
  async get(@Param('slug') _slug: string, @Param('boardId') boardId: number) {
    return await this.boardsService.getTransformedBoard(boardId);
  }

  @Patch(':slug/boards/:boardId')
  async update(
    @Param('slug') slug: string,
    @Param('boardId') boardId: number,
    @Body() board: BoardDto,
  ) {
    return await this.boardsService.update(slug, boardId, board);
  }

  @Post(':slug/boards/:boardId/open')
  async open(@Param('boardId') boardId: number) {
    await this.boardsService.open(boardId);
    return { message: 'Board updated' };
  }

  @Post(':slug/boards/:boardId/close')
  async close(@Param('boardId') boardId: number) {
    await this.boardsService.close(boardId);
    return { message: 'Board updated' };
  }

  @Post(':slug/settings')
  async updateSettings(
    @Param('slug') slug: string,
    @Body() settings: { hideDone: boolean },
  ) {
    await this.boardsService.updateSettings(slug, settings);
    return { message: 'Settings updated' };
  }

  @Post(':slug/boards/:boardId/move')
  async moveTicket(
    @Param('slug') slug: string,
    @Param('boardId') boardId: number,
    @Body() data: { origin: number; target: number },
  ) {
    await this.boardsService.moveTicket(slug, +boardId, data);
    return { message: 'Board updated' };
  }

  @Post(':slug/boards/move')
  async moveBoard(
    @Param('slug') slug: string,
    @Body() data: { origin: number; target: number },
  ) {
    await this.boardsService.moveBoard(slug, +data.origin, +data.target);
    return { message: 'Board updated' };
  }
}
