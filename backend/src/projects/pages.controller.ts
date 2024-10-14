import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Transformer } from './transformer';
import { PageService } from './page.service';
import { Page } from './entities/page';
import { PageDto } from './dto/page.dto';

@Controller('api/v3/projects')
export class PagesController {
  constructor(
    private readonly userService: UsersService,
    private readonly transformer: Transformer,
    private readonly pageService: PageService,
  ) {}

  @Get(':slug/pages')
  async getAll(@Param('slug') slug: string) {
    const tickets = await this.pageService.getAll(slug);

    const pageDTOs = await Promise.all(
      tickets.map(async (page: Page) => this.transformer.page(page)),
    );
    return pageDTOs;
  }

  @Get(':slug/opened-pages')
  async getOpenedPages(@Param('slug') slug: string) {
    const pages = await this.pageService.getOpenedPages();
    return pages;
  }

  @Post(':slug/opened-pages')
  async setOpenedPages(
    @Param('slug') slug: string,
    @Body() body: { pageId: number },
  ) {
    const pages = await this.pageService.getOpenedPages();
    const newPage = body.pageId;
    const updatedPages = pages.includes(newPage)
      ? pages.filter((page) => page !== newPage)
      : [...pages, newPage];
    await this.pageService.setOpenedPages(updatedPages);
    return updatedPages;
  }

  @Get(':slug/pages/:id')
  async get(@Param('slug') slug: string, @Param('id') id: number) {
    const page = await this.pageService.get(slug, id);
    return this.transformer.page(page);
  }

  @Patch(':slug/pages/:id')
  async update(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @Body() body: PageDto,
  ) {
    const page = await this.pageService.update(slug, id, body);
    return this.transformer.page(page);
  }
}
