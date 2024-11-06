import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/user.service';
import { ProjectDashboardDataDto } from './dto/project-dashboard-data.dto';
import { ProjectMetaDto } from './dto/project-meta.dto';
import { ProjectDto } from './dto/project.dto';
import { Board } from './entities/board';
import { Project } from './entities/project';
import { Ticket } from './entities/ticket';
import { ticketStates } from './models/ticket-states';
import { ticketTypes } from './models/ticket-types';
import { TransformService } from './transform.service';
import { Op } from 'sequelize';

@Injectable()
export class ProjectService {
  constructor(
    private userService: UserService,
    private transformer: TransformService,
  ) {}

  async fetchProjects() {
    const projects = await Project.findAll({
      where: { archived: false },
    });
    const user = this.userService.user;
    const allowedProjects = projects.filter(
      (project) =>
        user.isAdmin || user.projectAccess.split('_').includes(`${project.id}`),
    );
    return allowedProjects;
  }

  async getTransformedProjects() {
    const projects = await this.fetchProjects();
    return await Promise.all(projects.map(this.project));
  }

  async fetchProject(slug: string) {
    const project = await Project.findOne({ where: { short: slug } });
    const user = await this.userService.user;
    if (
      user.isAdmin ||
      user.projectAccess.split('_').indexOf(`${project.id}`) !== -1
    ) {
      return project;
    }
    throw new Error('You are not allowed to view this project');
  }

  async getTransformedProject(slug: string) {
    const project = await this.fetchProject(slug);
    return this.project(project);
  }

  async createProject(project: ProjectDto) {
    const user = this.userService.user;

    if (project.slug.length !== 2) {
      throw new Error('Slug must be 2 characters long');
    }

    const existingProject = await Project.findOne({
      where: { slug: project.slug },
    });
    if (existingProject) {
      throw new Error('Project with this slug already exists');
    }

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
    const project = await this.fetchProject(slug);

    const users = await User.findAll();
    const userDTOs = users.map((user) => this.userService.transform(user));
    const boards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
      order: [['position', 'ASC']],
    });
    const smallBoardDtos = await Promise.all(
      boards.map(this.transformer.smallBoard),
    );
    return {
      project: project,
      users: userDTOs,
      types: ticketTypes,
      states: ticketStates,
      boards: smallBoardDtos,
    };
  }

  async getDashboardData(
    projectSlug: string,
  ): Promise<ProjectDashboardDataDto> {
    const user = this.userService.user;
    const project = await this.fetchProject(projectSlug);

    const tickets = await Ticket.findAll({
      where: {
        state: 'inProgress',
        assigned_id: user.id,
        project_id: project.id,
      },
    });

    const ticketDtos = await Promise.all(
      tickets.map(async (ticket: Ticket) =>
        this.transformer.ticket(projectSlug, ticket),
      ),
    );

    const dateBefore30Days = new Date(
      new Date().getTime() / 1000 - 30 * 24 * 60 * 60 * 1000,
    );
    const closedTicketsLast30Days = await Ticket.findAll({
      where: {
        project_id: project.id,
        parentId: null,
        state: 'done',
        closedAt: {
          [Op.gt]: dateBefore30Days,
        },
      },
    });

    const closedTicketsDtos = await Promise.all(
      closedTicketsLast30Days.map(async (ticket: Ticket) =>
        this.transformer.ticket(projectSlug, ticket),
      ),
    );

    const openedTicketsLast30Days = await Ticket.findAll({
      where: {
        project_id: project.id,
        parentId: null,
        createdAt: {
          [Op.gt]: dateBefore30Days,
        },
      },
    });

    const openedTicketsDtos = await Promise.all(
      openedTicketsLast30Days.map(async (ticket: Ticket) =>
        this.transformer.ticket(projectSlug, ticket),
      ),
    );

    return {
      tickets: ticketDtos,
      project: project,
      closedTicketsLast30Days: closedTicketsDtos,
      openedTicketsLast30Days: openedTicketsDtos,
    };
  }

  private project(project: Project): ProjectDto {
    return {
      id: project.id,
      slug: project.slug,
      icon: project.icon,
      title: project.title,
      description: project.description,
    };
  }
}
