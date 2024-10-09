import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { Project } from "./project.js";
import { User } from "./user.js";

export class Page extends Model {
  declare id: number;
  declare title: string;
  declare content: string;
  declare position: number;
  declare icon: string;
  declare createdAt: number;
  declare changedAt: number;
  declare creator_id: number;
  declare updator_id: number;
  declare parent_id: number;
  declare project_id: number;
}

Page.init(
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
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      defaultValue: "",
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "📒",
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    changedAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "changed_at",
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
    updator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Page,
        key: "id",
      },
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
  },
  { sequelize, tableName: "page", timestamps: false }
);
