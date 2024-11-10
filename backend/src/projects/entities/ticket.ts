import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Project } from './project';
import { Board } from './board';
import { TicketRelation } from './ticket-relation';

@Table({ tableName: 'ticket', timestamps: false })
export class Ticket extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false, defaultValue: '', type: DataTypes.TEXT('long') })
  description: string;

  @Column({ allowNull: false, defaultValue: 'open', field: 'state' })
  status: string;

  @Column({ allowNull: false, field: 'ticket_id' })
  ticketId: number;

  @Column({ allowNull: false, defaultValue: '' })
  type: string;

  @Column({ allowNull: false })
  position: number;

  @ForeignKey(() => Project)
  @Column
  project_id: number;

  @BelongsTo(() => Project, 'project_id')
  project: Project;

  @ForeignKey(() => Board)
  @Column
  board_id: number;

  @BelongsTo(() => Board, 'board_id')
  board: Board;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @ForeignKey(() => User)
  @Column
  assigned_id: number;

  @BelongsTo(() => User, 'assigned_id')
  assignee: User;

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

  @Column({ allowNull: true, field: 'closed_at', defaultValue: true })
  closedAt: number;

  @ForeignKey(() => Ticket)
  @Column({ allowNull: true, field: 'parent_id' })
  parentId: number;

  @BelongsTo(() => Ticket, 'parentId')
  parent: Ticket;

  @HasMany(() => Ticket, 'parentId')
  children: Ticket[];

  @HasMany(() => TicketRelation, { foreignKey: 'source_id', as: 'sourceRelations' })
  sourceRelations: TicketRelation[];

  @HasMany(() => TicketRelation, { foreignKey: 'target_id', as: 'targetRelations' })
  targetRelations: TicketRelation[];
}
