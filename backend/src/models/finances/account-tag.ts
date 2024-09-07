import { sequelize } from "../../utils/database.js";
import { DataTypes, Model } from "sequelize";

export class AccountTag extends Model {
  declare id: number;
  declare creator_id: number;
  declare title: string;
  declare icon: string;
}

AccountTag.init(
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
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: "account_tag", timestamps: false }
);
