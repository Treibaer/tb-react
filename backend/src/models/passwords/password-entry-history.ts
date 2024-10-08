import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";
import { PasswordEntry } from "./password-entry.js";

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
    entry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PasswordEntry,
        key: "id",
      },
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
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  { sequelize, tableName: "password_entry_history", timestamps: false }
);
