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
  },
  { sequelize, tableName: "access_token", timestamps: false }
);
