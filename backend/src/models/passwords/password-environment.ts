import { sequelize } from "../../utils/database.js";
import { DataTypes, Model, WhereOptions } from "sequelize";
import { PasswordEntry } from "./password-entry.js";

export class PasswordEnvironment extends Model {
  declare id: number;
  declare title: string;
  declare defaultLogin: string;
  declare creator_id: number;
  declare getEntries: (options?: WhereOptions) => Promise<PasswordEntry[]>;
}

PasswordEnvironment.init(
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
    defaultLogin: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "default_login",
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  { sequelize, tableName: "password_environment", timestamps: false }
);
