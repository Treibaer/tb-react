import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Project } from './entities/project';
import { ProjectDto } from './dto/project.dto';
import { ProjectMetaDto } from './dto/project-meta.dto';
import { User } from 'src/users/entities/user.entity';
import { ticketStates } from './models/ticket-states';
import { ticketTypes } from './models/ticket-types';
import { Board } from './entities/board';
import { BoardsService } from './boards.service';
import { ProjectDashboardDataDto } from './dto/project-dashboard-data.dto';
import { Ticket } from './entities/ticket';
import { TicketStatus } from './models/ticket-status';
import { TicketDto } from './dto/ticket.dto';
import { TicketsService } from './tickets.service';
import { Transformer } from './transformer';

@Injectable()
export class ProjectsService {
  constructor(
    private userService: UsersService,
    private boardService: BoardsService,
    private ticketService: TicketsService,
    private transformer: Transformer,
  ) {}

  async getAllProjects() {
    const projects = await Project.findAll({
      where: { archived: false },
    });
    const user = this.userService.user;
    const allowedProjects = projects.filter(
      (project) =>
        user.isAdmin || user.projectAccess.split('_').includes(`${project.id}`),
    );
    return await Promise.all(allowedProjects.map(this.project));
  }

  async getProject(slug: string): Promise<ProjectDto> {
    const project = await Project.findOne({ where: { short: slug } });
    const user = await this.userService.user;
    if (
      user.isAdmin ||
      user.projectAccess.split('_').indexOf(`${project.id}`) !== -1
    ) {
      return this.project(project);
    }
    throw new Error('You are not allowed to view this project');
  }

  async createProject(project: ProjectDto): Promise<ProjectDto> {
    const user = this.userService.user;

    await Project.create({
      ...project,
      creator_id: user.id,
    });

    // add project to user access
    if (!user.isAdmin) {
      const projectAccess = user.projectAccess.split('_');
      projectAccess.push(`${project.id}`);
      user.projectAccess = projectAccess.join('_');
      await user.save();
    }
    return project;
  }

  async getProjectMetadata(slug: string): Promise<ProjectMetaDto> {
    const project = await this.getProject(slug);

    const users = await User.findAll();
    const userDTOs = users.map((user) => this.userService.transform(user));
    const boards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
      order: [['position', 'ASC']],
    });
    const smallBoardDTOs = await Promise.all(
      boards.map(this.boardService.smallBoard),
    );
    return {
      project: project,
      users: userDTOs,
      types: ticketTypes,
      states: ticketStates,
      boards: smallBoardDTOs,
    };
  }


  async getDashboardData(
    projectSlug: string
  ): Promise<ProjectDashboardDataDto> {
    const user = this.userService.user;
    const project = await this.getProject(projectSlug);

    const tickets = await Ticket.findAll({
      where: {
        state: "inProgress",
        assigned_id: user.id,
        project_id: project.id,
      },
    });

    const ticketDTOs = await Promise.all(
      tickets.map(async (ticket: Ticket) =>
        this.transformer.ticket(projectSlug, ticket)
      )
    );
    return {
      tickets: ticketDTOs,
      project: project,
    };
  }

  project(project: Project): ProjectDto {
    return {
      id: project.id,
      slug: project.slug,
      icon: project.icon,
      title: project.title,
      description: project.description,
    };
  }

}
