import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Ticket } from './ticket';
import { User } from 'src/users/entities/user.entity';

@Table({ tableName: 'ticket_relation', timestamps: false })
export class TicketRelation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @BelongsTo(() => Ticket, { foreignKey: 'source_id', as: 'source' })
  source: Ticket;

  @ForeignKey(() => Ticket)
  @Column
  source_id: number;

  @BelongsTo(() => Ticket, { foreignKey: 'target_id', as: 'target' })
  target: Ticket;

  @ForeignKey(() => Ticket)
  @Column
  target_id: number;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, { foreignKey: 'creator_id', as: 'creator' })
  creator: User;

  @Column({ allowNull: false, defaultValue: 'blocks' })
  type: string;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;
}
