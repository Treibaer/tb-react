import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { UserService } from 'src/users/user.service';
import { BoardDto } from './dto/board.dto';

@Controller('api/v3/projects')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardService,
    private readonly userService: UserService,
  ) {}

  @Get(':slug/tickets-board-structure')
  async getBoardStructure(@Param('slug') slug: string) {
    return await this.boardsService.getBoardStructure(slug);
  }

  @Get(':slug/boards')
  async getAll(@Param('slug') slug: string) {
    const boards = await this.boardsService.getAll(slug);
    const boardDTOs = await Promise.all(
      boards.map((board) => this.boardsService.board(board)),
    );
    return boardDTOs;
  }

  @Post(':slug/boards')
  async create(@Param('slug') slug: string, @Body() board: BoardDto) {
    return await this.boardsService.create(slug, board);
  }

  @Get(':slug/boards/:boardId')
  async get(@Param('slug') _slug: string, @Param('boardId') boardId: number) {
    const board = await this.boardsService.get(boardId);
    return this.boardsService.board(board);
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
  async open(@Param('slug') _slug: string, @Param('boardId') boardId: number) {
    await this.boardsService.open(boardId);
    return { message: 'Board updated' };
  }

  @Post(':slug/boards/:boardId/close')
  async close(@Param('slug') _slug: string, @Param('boardId') boardId: number) {
    await this.boardsService.close(boardId);
    return { message: 'Board updated' };
  }

  @Post(':slug/settings')
  async updateSettings(
    @Param('slug') slug: string,
    @Param('boardId') boardId: number,
    @Body() settings: Record<string, any>,
  ) {
    await this.boardsService.updateSettings(slug, settings);
    return { message: 'Settings updated' };
  }

  @Post(':slug/boards/:boardId/move')
  async moveTicket(
    @Param('slug') slug: string,
    @Param('boardId') boardId: number,
    @Body() data: Record<string, any>,
  ) {
    await this.boardsService.moveTicket(slug, boardId, data);
    return { message: 'Board updated' };
  }
}
