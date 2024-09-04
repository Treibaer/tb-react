import { DataTypes, Model, WhereOptions } from "sequelize";
import { sequelize } from "../utils/database.js";
import { Ticket } from "./ticket.js";

export class Project extends Model {
  declare id: number;
  declare icon: string;
  declare title: string;
  declare description: string;
  declare slug: string;
  declare archived: boolean;
  declare public: boolean;
  declare createdAt: number;
  declare perspective: string;
  declare setting: string;
  declare gameEngine: string;
  declare numberOfPlayers: string;
  declare battleSystem: string;
  declare tags: string;
  declare input: string;
  declare platforms: string;
  declare graphicStyle: string;
  declare uniqueSellingPoints: string;
  declare coverImage: string;
  declare getTickets: (options?: WhereOptions) => Promise<Ticket[]>;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "📽️",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "short",
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: Date.now() / 1000,
    },
    perspective: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    setting: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    gameEngine: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "game_engine",
    },
    numberOfPlayers: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "number_of_players",
    },
    battleSystem: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "battle_system",
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    input: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    graphicStyle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "graphic_style",
    },
    uniqueSellingPoints: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "unique_selling_points",
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "cover_image",
    },
  },
  { sequelize, tableName: "project", timestamps: false }
);
