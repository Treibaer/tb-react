import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { Project } from "./project.js";

export class Ticket extends Model {
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
  declare assigned_id: number | null;
  declare board_id: number | null;
  declare project_id: number;
  static async getBySlug(slug: string): Promise<Ticket> {
    const projectSlug = slug.split("-")[0];
    const ticketId = slug.split("-")[1];
    const project = await Project.getBySlug(projectSlug);
    const ticket = await Ticket.findOne({ where: { ticket_id: ticketId, project_id: project.id } });
    if (!ticket) {
      const error = new Error("Ticket not found") as any;
      error.statusCode = 404;
      throw error;
    }
    return ticket;
  }
}

Ticket.init(
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
      defaultValue: Math.floor(Date.now() / 1000),
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
      defaultValue: Math.floor(Date.now() / 1000),
    },
    position: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {sequelize, tableName: "ticket", timestamps: false}
);
