import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { Ticket } from "./ticket.js";
import { User } from "./user.js";

export class TicketHistory extends Model {
  declare id: number;
  declare description: string;
  declare createdAt: number;
  declare versionNumber: number;
  declare creator_id: number;
  declare ticket_id: number;
}

TicketHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ticket,
        key: "id",
      },
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    versionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "version_number",
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  {sequelize, tableName: "ticket_history", timestamps: false}
);
