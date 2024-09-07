import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";

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
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: Date.now() / 1000,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, tableName: "board", timestamps: false }
);
