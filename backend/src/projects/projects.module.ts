import { Module } from '@nestjs/common';
import { PagesController } from 'src/projects/pages.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from 'src/users/user.service';
import { BoardsController } from './boards.controller';
import { BoardService } from './board.service';
import { ProjectsController } from './projects.controller';
import { ProjectService } from './project.service';
import { TicketsController } from './tickets.controller';
import { TicketService } from './ticket.service';
import { TransformService } from './transform.service';
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
    UserService,
    ProjectService,
    BoardService,
    TicketService,
    PageService,
    TransformService,
  ],
})
export class ProjectsModule {}
