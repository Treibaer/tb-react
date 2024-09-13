import { Page } from "../models/page";
import { Ticket } from "../models/ticket";
import { TicketStatus } from "../models/ticket-status";
import Client from "./Client";

/**
 * Service class for managing pages within projects.
 */
export default class PageService {
  static shared = new PageService();
  private client = Client.shared;
  private constructor() {}

  /**
   * Creates a new page within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param title - The title of the page.
   * @param content - The content of the page.
   * @returns A promise that resolves to the created page.
   */
  async create(
    projectSlug: string,
    data: {
      status?: TicketStatus;
      assigneeId?: number;
      type?: string;
      boardId?: number;
      position?: number;
      title?: string;
      description?: string;
    }
  ) {
    const ticket = this.createTicketObject(data);
    return this.client.post(`/projects/${projectSlug}/tickets`, ticket);
  }

  /**
   * Retrieves all pages associated with a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to an array of pages.
   */
  async getAll(projectSlug: string) {
    return this.client.get<Page[]>(`/projects/${projectSlug}/pages`);
  }

  /**
   * Retrieves all pages associated with a specified project in a structured way.
   * @param projectSlug - The slug identifier of the project.
   * @returns A promise that resolves to an array of pages.
   */
  async getAllStructured(projectSlug: string) {
    const pages = await this.client.get<Page[]>(
      `/projects/${projectSlug}/pages`
    );
    // iterate over the pages, check the parent of every page and add itlself to the children array of the parent
    pages.forEach((pageDTO) => {
      if (pageDTO.parentId) {
        const parent = pages.find((page) => page.id === pageDTO.parentId);
        if (parent) {
          parent.children.push(pageDTO);
        }
      }
    });
    // sort all children by position
    pages.forEach((page) => {
      page.children.sort((a, b) => a.position - b.position);
    });
    // sort pages
    pages.sort((a, b) => a.position - b.position);
    return pages;
  }

  /**
   * Retrieves a specific page by its slug within a specified project.
   * @param projectSlug - The slug identifier of the project.
   * @param ticketSlug - The slug identifier of the page.
   * @returns A promise that resolves to the page details.
   */

  async get(projectSlug: string, pageId: number) {
    const url = `/projects/${projectSlug}/pages/${pageId}`;
    return this.client.get<Ticket>(url);
  }

  /**
   * Updates properties of a specific page within a project.
   * Supports partial updates.
   * @param projectSlug - The slug identifier of the project.
   * @param ticketSlug - The slug identifier of the page.
   * @param data - The updated page data.
   * @returns A promise that resolves to the updated page.
   */
  async update(
    projectSlug: string,
    pageId: number,
    data: {
      title?: string;
      content?: string;
    }
  ) {
    const url = `/projects/${projectSlug}/pages/${pageId}`;
    return this.client.patch<Page>(url, data);
  }

  /**
   * Deletes a specific page within a project.
   * @param projectSlug - The slug identifier of the project.
   * @param ticketSlug - The slug identifier of the page.
   */
  async delete(projectSlug: string, ticketSlug: string) {
    // const url = `/projects/${projectSlug}/tickets/${ticketSlug}`;
    throw new Error("Method not implemented.");
    // return this.client.delete(url);
  }

  async getOpenedPages(projectSlug: string) {
    const url = `/projects/${projectSlug}/opened-pages`;
    return this.client.get<number[]>(url);
  }

  async togglePage(projectSlug: string, pageId: number) {
    const url = `/projects/${projectSlug}/opened-pages`;
    return this.client.post<void>(url, { pageId });
  }

  private createTicketObject(data: {
    status?: TicketStatus;
    assigneeId?: number;
    type?: string;
    boardId?: number;
    position?: number;
    title?: string;
    description?: string;
  }) {
    return {
      id: 0,
      title: data.title,
      description: data.description,
      type: data.type ?? "",
      status: data.status ?? "open",
      boardId: data.boardId ?? 0,
      assigneeId: data.assigneeId,
    };
  }
}
