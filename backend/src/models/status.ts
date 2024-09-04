import { sequelize } from "../utils/database.js";
import { DataTypes, Model } from "sequelize";

export class Status extends Model {
  declare id: number;
  declare value: string;
  declare host: string;
  declare port: number;
  declare type: "development" | "production";
}

Status.init(
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
    host: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: "status", timestamps: false }
);
