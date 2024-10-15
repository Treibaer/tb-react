import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketDto } from './dto/ticket.dto';
import { Ticket } from './entities/ticket';
import { TicketService } from './ticket.service';
import { TransformService } from './transform.service';

@Controller('api/v3/projects')
export class TicketsController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly transformer: TransformService,
  ) {}

  @Get(':slug/tickets')
  async getTickets(@Param('slug') slug: string) {
    const tickets = await this.ticketService.getAll(slug);

    const ticketDTOs = await Promise.all(
      tickets.map(async (ticket: Ticket) =>
        this.transformer.ticket(slug, ticket),
      ),
    );
    return ticketDTOs;
  }

  @Post(':slug/tickets')
  async createTicket(@Param('slug') slug: string, @Body() ticket: TicketDto) {
    return this.ticketService.create(slug, ticket);
  }

  @Get(':slug/tickets/:ticketSlug')
  async getTicket(
    @Param('slug') slug: string,
    @Param('ticketSlug') ticketSlug: string,
  ) {
    return this.transformer.ticket(
      slug,
      await this.ticketService.get(slug, ticketSlug),
    );
  }

  @Patch(':slug/tickets/:ticketSlug')
  async updateTicket(
    @Param('slug') slug: string,
    @Param('ticketSlug') ticketSlug: string,
    @Body()
    data: TicketDto & {
      assigneeId?: number;
      boardId?: number;
      position?: number;
    },
  ) {
    return this.ticketService.update(slug, ticketSlug, data);
  }

  @Get(':slug/tickets/:ticketSlug/history')
  async getTicketHistory(
    @Param('slug') _slug: string,
    @Param('ticketSlug') ticketSlug: string,
  ) {
    const historyList = await this.ticketService.getHistory(ticketSlug);
    const historyDTOs = await Promise.all(
      historyList.map(async (history) =>
        this.ticketService.ticketHistory(history),
      ),
    );
    return historyDTOs;
  }

  @Get(':slug/tickets/:ticketSlug/comments')
  async getTicketComments(
    @Param('slug') _slug: string,
    @Param('ticketSlug') ticketSlug: string,
  ) {
    const comments = await this.ticketService.getComments(ticketSlug);
    const commentDTOs = await Promise.all(
      comments.map(async (comment) =>
        this.ticketService.ticketComment(comment),
      ),
    );
    return commentDTOs;
  }

  @Post(':slug/tickets/:ticketSlug/comments')
  async createTicketComment(
    @Param('slug') _slug: string,
    @Param('ticketSlug') ticketSlug: string,
    @Body() { content }: { content: string },
  ) {
    return this.ticketService.ticketComment(
      await this.ticketService.createComment(ticketSlug, content),
    );
  }

  @Delete(':slug/tickets/:ticketSlug/comments/:commentId')
  async removeTicketComment(
    @Param('slug') _slug: string,
    @Param('ticketSlug') ticketSlug: string,
    @Param('commentId') commentId: number,
  ) {
    await this.ticketService.removeComment(ticketSlug, commentId);
  }
}
