import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { PasswordEnvironment } from './password-environment';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'password_entry', timestamps: false })
export class PasswordEntry extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, "creator_id")
  creator: User;

  @ForeignKey(() => PasswordEnvironment)
  @Column
  environment_id: number;

  @BelongsTo(() => PasswordEnvironment, "environment_id")
  environment: PasswordEnvironment;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  login: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  url: string;

  @Column({ allowNull: false, type: DataTypes.TEXT("long") })
  notes: string;

  @Column({
    field: 'last_used',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  lastUsed: number;

  @Column({
    field: 'amount_used',
    allowNull: false,
    defaultValue: 0,
  })
  amountUsed: number;

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

  @Column({ allowNull: false })
  archived: boolean;
}
