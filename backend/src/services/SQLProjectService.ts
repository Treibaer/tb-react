import { Board } from "../models/board.js";
import { ProjectDTO, ProjectMetaDTO } from "../models/dtos.js";
import { ProjectEntity } from "../models/project.js";
import { ticketStates } from "../models/ticket-states.js";
import { ticketTypes } from "../models/ticket-types.js";
import Transformer from "../utils/Transformer.js";
import Validator from "../utils/Validator.js";
import { IProjectService } from "./interfaces/IProjectService.js";
import UserService from "./UserService.js";

export class SQLProjectService implements IProjectService {
  static shared = new SQLProjectService();
  private userService = UserService.shared;

  async create(project: ProjectDTO): Promise<ProjectDTO> {
    const user = await this.userService.getUser();

    await Validator.validateNewProject(project);
    const createdProject = await user.createProject(project);
    return Transformer.project(createdProject);
  }

  async get(slug: string): Promise<ProjectDTO | null> {
    const project = await ProjectEntity.findOne({ where: { slug } });
    return project ? Transformer.project(project) : null;
  }

  async getAll(): Promise<ProjectDTO[]> {
    const projects = await ProjectEntity.findAll({
      where: { archived: false },
    });
    return await Promise.all(projects.map(Transformer.project));
  }

  async getMetadata(slug: string): Promise<ProjectMetaDTO | null> {
    const project = await this.get(slug);
    if (!project) return null;

    const users = await UserService.shared.getAll();
    const userDTOs = users.map(Transformer.user);
    const boards = await Board.findAll({ where: { project_id: project.id } });
    boards.sort((a, b) => a.startDate - b.startDate);
    const smallBoardDTOs = await Promise.all(
      boards.map(Transformer.smallBoard)
    );
    return {
      project: project,
      users: userDTOs,
      types: ticketTypes,
      states: ticketStates,
      boards: smallBoardDTOs,
    };
  }

  async update(slug: string, project: ProjectDTO): Promise<ProjectDTO> {
    throw new Error("Method not implemented." + slug + project.id);
  }

  async deleteProject(slug: string): Promise<boolean> {
    throw new Error("Method not implemented." + slug);
  }
}
