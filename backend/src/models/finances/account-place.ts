import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";
import { User } from "../user.js";

// deprecated
export class AccountPlace extends Model {
  declare id: number;
  declare creator_id: number;
  declare title: string;
  declare icon: string;
}

AccountPlace.init(
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
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  { sequelize, tableName: "account_place", timestamps: false }
);
