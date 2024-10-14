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
import { Board } from './board';
import { Ticket } from './ticket';

@Table({ tableName: 'ticket_comment', timestamps: false })
export class TicketComment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false, defaultValue: '', type: DataTypes.TEXT('long') })
  content: string;


  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;


  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;


  @ForeignKey(() => Ticket)
  @Column
  ticket_id: number;

  @BelongsTo(() => Ticket, 'ticket_id')
  ticket: Ticket;
}
