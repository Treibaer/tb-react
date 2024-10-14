import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";

@Table({ tableName: "account", timestamps: false })
export class Account extends Model {
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

  @Column({ allowNull: false, field: "value_in_cents" })
  valueInCents: number;

  @Column({ allowNull: false, field: "created_at", defaultValue: () => Math.floor(Date.now() / 1000) })
  createdAt: number;

  @Column({ allowNull: false, field: "icon_url" })
  iconUrl: string;

  @Column({ allowNull: false, field: "is_archived" })
  isArchived: boolean;
}
