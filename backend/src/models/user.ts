import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { ProjectDTO } from "./dtos.js";
import { ProjectEntity } from "./project.js";

export class User extends Model {
  declare id: number;
  declare email: string;
  declare firstName: string;
  declare roles: string;
  declare lastName: string;
  declare password: string;
  declare avatar: string;
  declare language: string;
  declare openedPages: string;
  declare closedBords: string;
  declare hideDoneProjects: string;
  declare isAdmin: boolean;
  declare projectAccess: string;
  declare maximized: boolean;
  declare selectedYear: number;
  declare phoneNumber: string;
  declare dateOfBirth: string;
  declare createdAt: number;
  declare createProject: (project: ProjectDTO) => Promise<ProjectEntity>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    roles: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "[]",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://i.pravatar.cc/150?u=1",
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "de",
    },
    openedPages: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "opened_pages",
    },
    closedBords: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "closed_boards",
    },
    hideDoneProjects: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "hide_done_projects",
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_admin",
    },
    projectAccess: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "project_access",
    },
    maximized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    selectedYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3000,
      field: "selected_year",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      field: "phone_number",
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "date_of_birth",
      defaultValue: "",
    },
    createdAt: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: "created_at",
      defaultValue: Date.now() / 1000,
    },
  },
  { sequelize, tableName: "user", timestamps: false }
);
