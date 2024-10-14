import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AccessToken } from './auth/entities/access-token';
import { UsersService } from './users/users.service';
import { UrlService } from './shared/urlservice';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StatusModule } from './status/status.module';
import { Status } from './status/entities/status';
import { PasswordsModule } from './passwords/passwords.module';
import { PasswordEnvironment } from './passwords/entities/password-environment';
import { PasswordEntry } from './passwords/entities/password-entry';
import { PasswordEntryHistory } from './passwords/entities/password-entry-history';
import { FinancesModule } from './finances/finances.module';
import { Account } from './finances/entities/account';
import { AccountEntry } from './finances/entities/account-entry';
import { AccountTag } from './finances/entities/account-tag';
import { AccountPlace } from './finances/entities/account-place';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project';
import { Board } from './projects/entities/board';
import { BoardsService } from './projects/boards.service';
import { SharedModule } from './shared/shared.module';
import { Ticket } from './projects/entities/ticket';
import { TicketHistory } from './projects/entities/ticket-history';
import { TicketComment } from './projects/entities/ticket-comment';
import { Transformer } from './projects/transformer';
import { PageService } from './projects/page.service';
import { Page } from './projects/entities/page';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        '.env',
        '/projects/react/tb-react/backend/.env',
      ],
    }),

    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'public', 'avatars'),
        serveRoot: '/avatars',
      },
      {
        rootPath: join(__dirname, '..', 'public', 'images'),
        serveRoot: '/images',
      },
    ),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mariadb',
        host: configService.get('DB_HOST'),
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        models: [
          // Deck,
          AccessToken,
          User,
          Status,
          PasswordEnvironment,
          PasswordEntry,
          PasswordEntryHistory,
          Account,
          AccountEntry,
          AccountTag,
          AccountPlace,
          Project,
          Board,
          Ticket,
          TicketHistory,
          TicketComment,
          Page,
        ],
        autoLoadModels: true,
        logging: false,
      }),
    }),
    UsersModule,
    AuthModule,
    StatusModule,
    PasswordsModule,
    FinancesModule,
    ProjectsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    BoardsService,
    Transformer,
    PageService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    User.sync({ alter: true });
    AccessToken.sync({ alter: true });
    Status.sync({ alter: true });
    PasswordEnvironment.sync({ alter: true });
    PasswordEntry.sync({ alter: true });
    PasswordEntryHistory.sync({ alter: true });
    Account.sync({ alter: true });
    AccountEntry.sync({ alter: true });
    AccountTag.sync({ alter: true });
    AccountPlace.sync({ alter: true });
    Project.sync({ alter: true });
    Board.sync({ alter: true });
    Ticket.sync({ alter: true });
    TicketHistory.sync({ alter: true });
    TicketComment.sync({ alter: true });
    Page.sync({ alter: true });
  }
}
