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
import { Ticket } from './ticket';

@Table({ tableName: 'ticket_history', timestamps: false })
export class TicketHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticket_id: number;

  @BelongsTo(() => Ticket, 'ticket_id')
  ticket: Ticket;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @Column({ allowNull: false, type: DataTypes.TEXT('long') })
  description: string;

  @Column({ allowNull: false, field: 'version_number' })
  versionNumber: number;

  @Column({
    allowNull: false,
    field: 'created_at',
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;
}
