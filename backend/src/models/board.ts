import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { Project } from "./project.js";
import { User } from "./user.js";

export class Board extends Model {
  declare id: number;
  declare title: string;
  declare project_id: number;
  declare creator_id: number;
  declare isActive: boolean;
  declare position: number;
}

Board.init(
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "active",
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "start_date",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    endDate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "end_date",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "id",
      },
    },
  },
  { sequelize, tableName: "board", timestamps: false }
);
