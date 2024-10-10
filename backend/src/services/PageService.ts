import { PageDTO } from "../dtos/page-dto.js";
import { TicketDTO } from "../dtos/ticket-dto.js";
import { Page } from "../models/page.js";
import { Project } from "../models/project.js";
import LegacyTicketService from "./LegacyTicketService.js";
import UserService from "./UserService.js";

export class PageService {
  static shared = new PageService();
  private constructor() {}

  async get(projectSlug: string, pageId: number): Promise<Page> {
    const project = await Project.getBySlug(projectSlug);
    const page = await Page.findByPk(pageId);
    if (!page) {
      const error: any = new Error("Page not found");
      error.statusCode = 404;
      throw error;
    }
    if (page.project_id !== project.id) {
      const error: any = new Error("Page not found");
      error.statusCode = 404;
      throw error;
    }
    return page;
  }

  async getAll(projectSlug: string): Promise<Page[]> {
    const project = await Project.getBySlug(projectSlug);
    const pages = await Page.findAll({
      where: { project_id: project.id },
    });
    pages.sort((a, b) => b.changedAt - a.changedAt);
    return pages;
  }

  async getOpenedPages(): Promise<number[]> {
    const user = await UserService.shared.getUser();
    const openedPages = user.openedPages.split("_");
    return openedPages.map(Number);
  }
  
  async setOpenedPages(pages: number[]): Promise<void> {
    const user = await UserService.shared.getUser();
    user.openedPages = pages.join("_");
    await user.save();
  }

  async create(projectSlug: string, ticket: TicketDTO): Promise<TicketDTO> {
    return LegacyTicketService.shared.createTicket(projectSlug, ticket);
  }

  async update(
    _: string,
    pageId: number,
    data: PageDTO
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
