import fs from "fs";
import path from "path";
import { Project, Ticket } from "../Models";

// Directory path
const dir: string = path.join(process.cwd(), "data");
// const ticketsPath = path.join(dir, "tickets.json");

export default class TicketsService {
  static shared = new TicketsService();

  private constructor() {}

  async loadTicket(projectId: number, id: number): Promise<Ticket | undefined> {
    const projects = await this.loadTickets(projectId);
    return projects.find((d) => d.id === id);
  }

  async saveTicket(ticket: Ticket): Promise<Ticket> {
    const tickets = await this.loadTickets(ticket.projectId);

    const existingTicket = tickets.find((d) => d.id === ticket.id);
    console.log("existingTicket", existingTicket);
    

    if (existingTicket) {
      existingTicket.title = ticket.title;
      existingTicket.description = ticket.description;
      existingTicket.updatedAt = Math.floor(new Date().getTime() / 1000);
      existingTicket.state = ticket.state;
    } else if (ticket.id !== undefined) {
      throw new Error("Ticket not found");
    } else {
      ticket.id = tickets.length + 1;
      ticket.createdAt = Math.floor(new Date().getTime() / 1000);
      ticket.updatedAt = Math.floor(new Date().getTime() / 1000);
      tickets.push(ticket);
    }
    await this.saveTickets(ticket.projectId, tickets);
    return existingTicket || ticket;
  }

  async loadTickets(projectId: number): Promise<Ticket[]> {
    const ticketsPath = this.ticketsPath(projectId);

    if (!fs.existsSync(ticketsPath)) {
      return [];
    }
    const rawTickets = fs.readFileSync(ticketsPath, "utf-8");
    const tickets = JSON.parse(rawTickets);
    return tickets.filter((ticket: Ticket) => ticket.projectId === projectId);
  }

  async saveTickets(projectId: number, tickets: Ticket[]): Promise<void> {
    fs.writeFileSync(
      this.ticketsPath(projectId),
      JSON.stringify(tickets, null, 2)
    );
  }

  private ticketsPath(projectId: number): string {
    return path.join(dir, `tickets-${projectId}.json`);
  }
}
