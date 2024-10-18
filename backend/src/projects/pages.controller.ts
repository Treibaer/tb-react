import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PageDto } from './dto/page.dto';
import { PageService } from './page.service';

@Controller('api/v3/projects')
export class PagesController {
  constructor(private readonly pageService: PageService) {}

  @Get(':slug/pages')
  async getAll(@Param('slug') slug: string) {
    return await this.pageService.getTransformedPages(slug);
  }

  @Get(':slug/pages/:id')
  async get(@Param('slug') slug: string, @Param('id') id: number) {
    return await this.pageService.getTransformedPage(slug, id);
  }

  @Patch(':slug/pages/:id')
  async update(@Param('id') id: number, @Body() pageDto: PageDto) {
    return await this.pageService.update(id, pageDto);
  }

  @Get(':slug/opened-pages')
  async getOpenedPages() {
    return await this.pageService.getOpenedPages();
  }

  @Post(':slug/opened-pages')
  async setOpenedPages(@Body() body: { pageId: number }) {
    const pages = await this.pageService.getOpenedPages();
    const newPage = body.pageId;
    const updatedPages = pages.includes(newPage)
      ? pages.filter((page) => page !== newPage)
      : [...pages, newPage];
    await this.pageService.setOpenedPages(updatedPages);
    return updatedPages;
  }
}
