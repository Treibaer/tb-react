import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { Project } from "./project.js";
import { User } from "./user.js";
import { Board } from "./board.js";

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
  declare closedAt: number | null;
  static async getBySlug(slug: string): Promise<Ticket> {
    const projectSlug = slug.split("-")[0];
    const ticketId = slug.split("-")[1];
    const project = await Project.getBySlug(projectSlug);
    const ticket = await Ticket.findOne({
      where: { ticket_id: ticketId, project_id: project.id },
    });
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
      type: DataTypes.TEXT("long"),
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
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ticket_id",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    changedAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "changed_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    closedAt: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "closed_at",
      defaultValue: null,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
      // onDelete: "SET NULL", // Optional: Handle cascading deletes
      // onUpdate: "CASCADE", // Optional: Handle updates to the project ID
    },
    assigned_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "assigned_id",
      references: {
        model: User,
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
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "board_id",
      references: {
        model: Board, // Reference to the Project model
        key: "id", // Referencing the id column in Project
      },
    },
  },
  { sequelize, tableName: "ticket", timestamps: false }
);
