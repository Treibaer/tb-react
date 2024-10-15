import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('api/v3/projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectService,
  ) {}

  @Get()
  async getProjects() {
    return this.projectService.getTransformedProjects();
  }

  @Get(':slug')
  async getProject(@Param('slug') slug: string) {
    return this.projectService.getTransformedProject(slug);
  }

  @Post()
  async createProject(@Body() project: ProjectDto) {
    return this.projectService.createProject(project);
  }

  @Get(':slug/metadata')
  async getProjectMetadata(@Param('slug') slug: string) {
    return this.projectService.getProjectMetadata(slug);
  }

  @Get(':slug/dashboard')
  async getProjectsDashboardData(@Param('slug') slug: string) {
    return this.projectService.getDashboardData(slug);
  }
}
