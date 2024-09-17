import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";

export class TicketHistory extends Model {
  declare id: number;
  declare description: string;
  declare createdAt: number;
  declare versionNumber: number;
  declare creator_id: number;
  declare ticket_id: number;
}

TicketHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    versionNumber: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "version_number",
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: Math.floor(Date.now() / 1000),
    },
  },
  {sequelize, tableName: "ticket_history", timestamps: false}
);
