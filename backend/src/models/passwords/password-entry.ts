import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";

export class PasswordEntry extends Model {
  declare id: number;
  declare title: string;
  declare login: string;
  declare password: string;
  declare url: string;
  declare notes: string;
  declare creator_id: number;
  declare environment_id: number;
}

PasswordEntry.init(
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
    lastUsed: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "last_used",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    amountUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "amount_used",
      defaultValue: 0,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  { sequelize, tableName: "password_entry", timestamps: false }
);
