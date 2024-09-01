import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";

export class TicketEntity extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare status: string;
  declare createdAt: number;
  declare ticketId: number;
  declare type: string;
  declare changedAt: number;
  declare position: number;
  declare creator_id: number;
  declare assigned_id: number;
  declare board_id: number;
}

TicketEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
      field: "state",
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: Date.now() / 1000,
    },
    ticketId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "ticket_id",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    changedAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "changed_at",
      defaultValue: Date.now() / 1000,
    },
    position: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {sequelize, tableName: "ticket", timestamps: false}
);
