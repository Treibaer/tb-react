import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";

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
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "📒",
    },
    position: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    changedAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "changed_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  { sequelize, tableName: "page", timestamps: false }
);
