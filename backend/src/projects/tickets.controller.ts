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
import { TicketService } from './ticket.service';

@Controller('api/v3/projects')
export class TicketsController {
  constructor(private readonly ticketService: TicketService) {}

  @Get(':slug/tickets')
  async getTickets(@Param('slug') slug: string) {
    return this.ticketService.getTransformedTickets(slug);
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
    return this.ticketService.getTransformedTicket(slug, ticketSlug);
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

  @Delete(':slug/tickets/:ticketSlug')
  async removeTicket(
    @Param('slug') slug: string,
    @Param('ticketSlug') ticketSlug: string,
  ) {
    await this.ticketService.remove(slug, ticketSlug);
  }

  @Get(':slug/tickets/:ticketSlug/history')
  async getTicketHistory(@Param('ticketSlug') ticketSlug: string) {
    return this.ticketService.getTransformedHistory(ticketSlug);
  }

  @Get(':slug/tickets/:ticketSlug/comments')
  async getTicketComments(
    @Param('slug') _slug: string,
    @Param('ticketSlug') ticketSlug: string,
  ) {
    return this.ticketService.getTransformedComments(ticketSlug);
  }

  @Post(':slug/tickets/:ticketSlug/comments')
  async createTicketComment(
    @Param('slug') _slug: string,
    @Param('ticketSlug') ticketSlug: string,
    @Body() { content }: { content: string },
  ) {
    return await this.ticketService.createComment(ticketSlug, content);
  }

  @Delete(':slug/tickets/:ticketSlug/comments/:commentId')
  async removeTicketComment(
    @Param('slug') _slug: string,
    @Param('ticketSlug') ticketSlug: string,
    @Param('commentId') commentId: number,
  ) {
    await this.ticketService.removeComment(ticketSlug, commentId);
  }

  @Post(':slug/tickets/:ticketSlug/move')
  async moveTicket(
    @Param('ticketSlug') ticketSlug: string,
    @Body() data: Record<string, any>,
  ) {
    await this.ticketService.moveSubtask(ticketSlug, data.origin, data.target);
    return { message: 'Ticket updated' };
  }
}
