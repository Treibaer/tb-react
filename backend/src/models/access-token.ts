import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { User } from "./user.js";

export class AccessToken extends Model {
  declare id: number;
  declare user_id: number;
  declare value: string;
}
AccessToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
      field: "last_used",
    },
    createdAt: {
      type: DataTypes.INTEGER,
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
