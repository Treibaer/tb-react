import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { User } from "../user.js";

export class PasswordEnvironment extends Model {
  declare id: number;
  declare title: string;
  declare defaultLogin: string;
  declare creator_id: number;
}

PasswordEnvironment.init(
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
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  { sequelize, tableName: "password_environment", timestamps: false }
);
