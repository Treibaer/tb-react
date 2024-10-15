import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";

@Table({ tableName: "access_token", timestamps: false })
export class AccessToken extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  value: string;

  @Column
  client: string;

  @Column({ field: "last_used" })
  lastUsed: number;

  @Column({ field: "created_at" })
  createdAt: number;

  @Column
  ip: string;

  // relation to user entity with foregin key user_id
  @BelongsTo(() => User, "user_id")
  user: User;

  @ForeignKey(() => User)
  @Column
  user_id: number;
}
