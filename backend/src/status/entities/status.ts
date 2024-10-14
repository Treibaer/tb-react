import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "status", timestamps: false })
export class Status extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true, allowNull: false })
  id: number;

  @Column
  title: string;

  @Column
  host: string;

  @Column
  port: number;

  @Column
  type: "development" | "production";
}
