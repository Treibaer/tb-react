import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";

export class TicketComment extends Model {
  declare id: number;
  declare content: string;
  declare createdAt: number;
  declare creator_id: number;
  declare ticket_id: number;
}

TicketComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  {sequelize, tableName: "ticket_comment", timestamps: false}
);
