import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { PageDto } from './dto/page.dto';
import { Page } from './entities/page';
import { Project } from './entities/project';
import { TransformService } from './transform.service';

@Injectable()
export class PageService {
  constructor(
    private userService: UserService,
    private readonly transformer: TransformService,
  ) {}

  async fetchPages(projectSlug: string): Promise<Page[]> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const pages = await Page.findAll({
      where: { project_id: project.id },
      order: [['changedAt', 'DESC']],
    });
    return pages;
  }

  async getTransformedPages(projectSlug: string): Promise<PageDto[]> {
    const pages = await this.fetchPages(projectSlug);
    return await this.transformer.pages(pages);
  }

  async get(projectSlug: string, pageId: number): Promise<Page> {
    const project = await Project.findOne({ where: { slug: projectSlug } });
    const page = await Page.findByPk(pageId);
    if (!page || page.project_id !== project.id) {
      throw new NotFoundException('Page not found');
    }
    return page;
  }

  async update(pageId: number, pageDto: PageDto): Promise<Page> {
    const page = await Page.findByPk(pageId);
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    page.title = pageDto.title;
    page.content = pageDto.content;
    await page.save();
    return page;
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
}
