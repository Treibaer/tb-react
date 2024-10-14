import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Project } from './project';

@Table({ tableName: 'board', timestamps: false })
export class Board extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @ForeignKey(() => Project)
  @Column
  project_id: number;

  @BelongsTo(() => Project, 'project_id')
  project: Project;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false, field: 'active' })
  isActive: boolean;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @Column({ allowNull: false, field: 'archived', defaultValue: false })
  isArchived: boolean;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;

  @Column({
    field: 'start_date',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  startDate: number;

  @Column({
    field: 'end_date',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  endDate: number;

  @Column({ allowNull: false })
  position: number;
}
