import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";

export class PasswordEntryHistory extends Model {
  declare id: number;
  declare title: string;
  declare login: string;
  declare creator_id: number;
  declare environment_id: number;
}

PasswordEntryHistory.init(
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
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  { sequelize, tableName: "password_entry_history", timestamps: false }
);
