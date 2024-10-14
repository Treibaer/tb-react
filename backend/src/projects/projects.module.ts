import { Module } from '@nestjs/common';
import { PagesController } from 'src/projects/pages.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from 'src/users/users.service';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { Transformer } from './transformer';
import { PageService } from './page.service';

@Module({
  imports: [SharedModule],
  controllers: [
    ProjectsController,
    BoardsController,
    TicketsController,
    PagesController,
  ],
  providers: [
    UsersService,
    ProjectsService,
    BoardsService,
    TicketsService,
    PageService,
    Transformer,
  ],
})
export class ProjectsModule {}
