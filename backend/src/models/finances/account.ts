import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";

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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valueInCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "value_in_cents",
    },
  },
  { sequelize, tableName: "account", timestamps: false }
);
