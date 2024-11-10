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

  @ForeignKey(() => Ticket)
  @Column({ allowNull: true, field: 'source_id' })
  sourceId: number;

  @BelongsTo(() => Ticket, { foreignKey: 'sourceId', as: 'source' })
  source: Ticket;

  @ForeignKey(() => Ticket)
  @Column({ allowNull: true, field: 'target_id' })
  targetId: number;

  @BelongsTo(() => Ticket, { foreignKey: 'targetId', as: 'target' })
  target: Ticket;

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
