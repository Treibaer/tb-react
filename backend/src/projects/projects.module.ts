import { forwardRef, Module } from '@nestjs/common';
import { PagesController } from 'src/projects/pages.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from 'src/users/user.service';
import { BoardService } from './board.service';
import { BoardsController } from './boards.controller';
import { PageService } from './page.service';
import { ProjectService } from './project.service';
import { ProjectsController } from './projects.controller';
import { EventsGateway } from './projects.gateway';
import { TicketService } from './ticket.service';
import { TicketsController } from './tickets.controller';
import { TransformService } from './transform.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SharedModule, forwardRef(() => UsersModule)],
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
    EventsGateway,
  ],
})
export class ProjectsModule {}
