import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";

@Table({ tableName: "account_place", timestamps: false })
export class AccountPlace extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true, allowNull: false })
  id: number;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, "creator_id")
  creator: User;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  icon: string;

  @Column({ allowNull: false, field: "created_at", defaultValue: () => Math.floor(Date.now() / 1000) })
  createdAt: number;
}
