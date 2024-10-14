import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';

@Controller('api/v3/projects')
export class ProjectsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get()
  async getProjects() {
    return this.projectsService.getAllProjects();
  }

  @Get(':slug')
  async getProject(@Param('slug') slug: string) {
    return this.projectsService.getProject(slug);
  }

  @Post()
  async createProject(@Body() project: ProjectDto) {
    return this.projectsService.createProject(project);
  }

  @Get(':slug/metadata')
  async getProjectMetadata(@Param('slug') slug: string) {
    return this.projectsService.getProjectMetadata(slug);
  }

  @Get(':slug/dashboard')
  async getProjectsDashboardData(@Param('slug') slug: string) {
    return this.projectsService.getDashboardData(slug);
  }
}
