import { ProjectDTO } from "../dtos/project-dto.js";
import { ProjectMetaDTO } from "../dtos/project-meta-dto.js";
import { Board } from "../models/board.js";
import { Project } from "../models/project.js";
import { ticketStates } from "../models/ticket-states.js";
import { ticketTypes } from "../models/ticket-types.js";
import Transformer from "../utils/Transformer.js";
import Validator from "../utils/Validator.js";
import UserService from "./UserService.js";

export class SQLProjectService {
  static shared = new SQLProjectService();
  private userService = UserService.shared;
  private constructor() {}

  async create(project: ProjectDTO): Promise<ProjectDTO> {
    const user = await this.userService.getUser();

    await Validator.validateNewProject(project);
    const createdProject = await user.createProject(project);
    return Transformer.project(createdProject);
  }

  async get(slug: string): Promise<Project> {
    return Project.getBySlug(slug);
  }

  async getAll(): Promise<ProjectDTO[]> {
    const projects = await Project.findAll({
      where: { archived: false },
    });
    return await Promise.all(projects.map(Transformer.project));
  }

  async getMetadata(slug: string): Promise<ProjectMetaDTO> {
    const project = await this.get(slug);

    const users = await UserService.shared.getAll();
    const userDTOs = users.map(Transformer.user);
    const boards = await Board.findAll({
      where: { project_id: project.id, isActive: true },
      order: [["position", "ASC"]],
    });
    const smallBoardDTOs = await Promise.all(
      boards.map(Transformer.smallBoard)
    );
    return {
      project: Transformer.project(project),
      users: userDTOs,
      types: ticketTypes,
      states: ticketStates,
      boards: smallBoardDTOs,
    };
  }

  async update(slug: string, project: ProjectDTO): Promise<ProjectDTO> {
    throw new Error(
      "Method not implemented. Slug: " + slug + ", Project ID: " + project.id
    );
  }

  async deleteProject(slug: string): Promise<boolean> {
    throw new Error("Method not implemented. Slug: " + slug);
  }
}
