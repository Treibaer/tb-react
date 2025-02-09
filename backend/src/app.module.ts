import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AssetsModule } from './assets/assets.module';
import { Asset } from './assets/entities/asset';
import { AssetEntry } from './assets/entities/asset-entry';
import { AuthModule } from './auth/auth.module';
import { AccessToken } from './auth/entities/access-token';
import { Account } from './finances/entities/account';
import { AccountEntry } from './finances/entities/account-entry';
import { AccountPlace } from './finances/entities/account-place';
import { AccountTag } from './finances/entities/account-tag';
import { FinancesModule } from './finances/finances.module';
import { PasswordEntry } from './passwords/entities/password-entry';
import { PasswordEntryHistory } from './passwords/entities/password-entry-history';
import { PasswordEnvironment } from './passwords/entities/password-environment';
import { PasswordsModule } from './passwords/passwords.module';
import { BoardService } from './projects/board.service';
import { Board } from './projects/entities/board';
import { Page } from './projects/entities/page';
import { Project } from './projects/entities/project';
import { Ticket } from './projects/entities/ticket';
import { TicketComment } from './projects/entities/ticket-comment';
import { TicketHistory } from './projects/entities/ticket-history';
import { TicketRelation } from './projects/entities/ticket-relation';
import { PageService } from './projects/page.service';
import { ProjectsModule } from './projects/projects.module';
import { TransformService } from './projects/transform.service';
import { SharedModule } from './shared/shared.module';
import { Status } from './status/entities/status';
import { StatusModule } from './status/status.module';
import { User } from './users/entities/user.entity';
import { UserService } from './users/user.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // Global file size limit (5MB in this case)
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        '.env',
        '/projects/react/tb-react/backend/.env',
      ],
    }),
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
          Asset,
          AssetEntry,
          TicketRelation,
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
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [UserService, BoardService, TransformService, PageService],
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    return;
    TicketRelation.sync({ alter: true });
    Asset.sync({ alter: true });
    AssetEntry.sync({ alter: true });
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
