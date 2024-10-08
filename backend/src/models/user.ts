import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database.js";
import { Project } from "./project.js";
import { ProjectDTO } from "../dtos/project-dto.js";

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
  declare closedBoards: string;
  declare hideDoneProjects: string;
  declare isAdmin: boolean;
  declare projectAccess: string;
  declare maximized: boolean;
  declare selectedYear: number;
  declare phoneNumber: string;
  declare dateOfBirth: string;
  declare createdAt: number;
  declare createProject: (project: ProjectDTO) => Promise<Project>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    selectedProjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "selected_project_id",
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        name: 'unique_user_email',
        msg: 'This email is already registered',
      },
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    roles: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      defaultValue: "[]",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
      defaultValue: "",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "de",
    },
    openedPages: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      defaultValue: "",
      field: "opened_pages",
    },
    closedBoards: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      defaultValue: "",
      field: "closed_boards",
    },
    hideDoneProjects: {
      type: DataTypes.TEXT("long"),
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
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_at",
      defaultValue: () => Math.floor(Date.now() / 1000),
    },
  },
  { sequelize, tableName: "user", timestamps: false }
);
