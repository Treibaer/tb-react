import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";
import { User } from "../user.js";
import { PasswordEnvironment } from "./password-environment.js";

export class PasswordEntry extends Model {
  declare id: number;
  declare title: string;
  declare login: string;
  declare password: string;
  declare url: string;
  declare notes: string;
  declare creator_id: number;
  declare environment_id: number;
  declare archived: boolean;
}

PasswordEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    environment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PasswordEnvironment,
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
    lastUsed: {
      type: DataTypes.INTEGER,
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
  },
  { sequelize, tableName: "password_entry", timestamps: false }
);
