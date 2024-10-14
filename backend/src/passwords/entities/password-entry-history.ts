import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { PasswordEntry } from './password-entry';
import { PasswordEnvironment } from './password-environment';

@Table({ tableName: 'password_entry_history', timestamps: false })
export class PasswordEntryHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @ForeignKey(() => PasswordEntry)
  @Column
  entry_id: number;

  @BelongsTo(() => PasswordEntry, 'entry_id')
  entry: PasswordEntry;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  login: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  url: string;

  @Column({ allowNull: false, type: DataTypes.TEXT('long') })
  notes: string;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @ForeignKey(() => PasswordEnvironment)
  @Column
  environment_id: number;

  @BelongsTo(() => PasswordEnvironment, 'environment_id')
  environment: PasswordEnvironment;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;
}
