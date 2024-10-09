import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { User } from "./user.js";
import { Ticket } from "./ticket.js";

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
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ticket,
        key: "id",
      },
    },
  },
  {sequelize, tableName: "ticket_comment", timestamps: false}
);
