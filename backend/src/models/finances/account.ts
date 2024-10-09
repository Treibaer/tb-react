import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../utils/database.js";
import { User } from "../user.js";

export class Account extends Model {
  declare id: number;
  declare title: string;
  declare valueInCents: number;
}

Account.init(
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
    valueInCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "value_in_cents",
    },
    created_at: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "icon_url",
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "is_archived",
    },
  },
  { sequelize, tableName: "account", timestamps: false }
);
