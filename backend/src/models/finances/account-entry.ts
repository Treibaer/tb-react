import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";

export class AccountEntry extends Model {
  declare id: number;
  declare title: string;
  declare createdAt: number;
  declare valueInCents: number;
  declare purchasedAt: number;
  declare account_id: number;
  declare creator_id: number;
  declare tag_id: number;
}

AccountEntry.init(
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
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
    },
    valueInCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "value_in_cents",
    },
    purchasedAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "purchased_at",
    },
  },
  { sequelize, tableName: "account_entry", timestamps: false }
);
