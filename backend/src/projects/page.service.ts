import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Transformer } from './transformer';
import { Project } from './entities/project';
import { Page } from './entities/page';
import { PageDto } from './dto/page.dto';

@Injectable()
export class PageService {
  constructor(
    private userService: UsersService,
    private transformer: Transformer,
  ) {}

  async getAll(projectSlug: string): Promise<Page[]> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    const pages = await Page.findAll({
      where: { project_id: project.id },
    });
    pages.sort((a, b) => b.changedAt - a.changedAt);
    return pages;
  }

  async getOpenedPages(): Promise<number[]> {
    const user = this.userService.user;
    const openedPages = user.openedPages.split('_');
    return openedPages.map(Number);
  }

  async setOpenedPages(pages: number[]): Promise<void> {
    const user = this.userService.user;
    user.openedPages = pages.join('_');
    await user.save();
  }

  async get(projectSlug: string, pageId: number): Promise<Page> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    const page = await Page.findByPk(pageId);
    if (!page) {
      const error: any = new Error('Page not found');
      error.statusCode = 404;
      throw error;
    }
    if (page.project_id !== project.id) {
      const error: any = new Error('Page not found');
      error.statusCode = 404;
      throw error;
    }
    return page;
  }
  async update(
    _: string,
    pageId: number,
    data: PageDto
  ): Promise<Page> {
    const page = await Page.findByPk(pageId);
    if (!page) {
      const error: any = new Error("Page not found");
      error.statusCode = 404;
      throw error;
    }
    page.title = data.title;
    page.content = data.content;
    await page.save();
    return page;
  }
}
