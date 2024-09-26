import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { User } from "./user.js";

export class AccessToken extends Model {
  declare id: number;
  declare value: string;
  declare getUser: () => Promise<User>;
}
AccessToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastUsed: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
      field: "last_used",
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
      field: "created_at",
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: "access_token", timestamps: false }
);
