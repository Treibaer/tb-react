import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";
import { User } from "../user.js";
import { Account } from "./account.js";
import { AccountTag } from "./account-tag.js";
import { AccountPlace } from "./account-place.js";

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
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Account,
        key: "id",
      },
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: User,
      },
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
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: AccountTag,
      },
    },
    place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: AccountPlace,
      },
    },
    purchasedAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "purchased_at",
    },
  },
  { sequelize, tableName: "account_entry", timestamps: false }
);
