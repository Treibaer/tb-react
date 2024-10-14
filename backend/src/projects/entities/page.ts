import { DataTypes } from 'sequelize';
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

@Table({ tableName: 'page', timestamps: false })
export class Page extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false, defaultValue: '', type: DataTypes.TEXT('long') })
  content: string;

  @Column({ allowNull: false, defaultValue: '📒' })
  icon: string;

  @Column({ allowNull: false })
  position: number;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @ForeignKey(() => User)
  @Column
  updator_id: number;

  @BelongsTo(() => User, 'updator_id')
  updator: User;

  @ForeignKey(() => Page)
  @Column
  parent_id: number;

  @BelongsTo(() => Page, 'parent_id')
  parent: Page;

  @ForeignKey(() => Project)
  @Column
  project_id: number;

  @BelongsTo(() => Project, 'project_id')
  project: Project;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;

  @Column({
    field: 'changed_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  changedAt: number;
}
