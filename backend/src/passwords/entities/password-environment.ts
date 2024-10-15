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

@Table({ tableName: 'password_environment', timestamps: false })
export class PasswordEnvironment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  // relation to user entity with foregin key user_id
  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @Column({ allowNull: false })
  title: string;

  @Column({ field: 'default_login', allowNull: false, defaultValue: '' })
  defaultLogin: string;

  
  @Column({ field: 'created_at', allowNull: false, defaultValue: () => Math.floor(Date.now() / 1000) })
  createdAt: number;
}
