import { User } from "../models/user.js";
import { ProjectEntity } from "../models/project.js";
import { AccessToken } from "../models/access-token.js";
import { TicketEntity } from "../models/ticket.js";
import { Board } from "../models/board.js";
import { TicketHistory } from "../models/ticket-history.js";

export const createRelations = () => {
  ProjectEntity.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });
  User.hasMany(ProjectEntity, {
    as: "projects",
    foreignKey: "creator_id",
  });

  AccessToken.belongsTo(User, {
    constraints: false,
    as: "user",
    foreignKey: "user_id",
  });

  ProjectEntity.hasMany(TicketEntity, {
    as: "tickets",
    foreignKey: "project_id",
  });

  TicketEntity.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });

  TicketEntity.belongsTo(User, {
    constraints: false,
    as: "assignee",
    foreignKey: "assigned_id",
  });

  TicketEntity.belongsTo(Board, {
    constraints: false,
    as: "board",
    foreignKey: "board_id",
  });

  Board.belongsTo(ProjectEntity, {
    constraints: false,
    as: "project",
    foreignKey: "project_id",
  });

  Board.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });
  
  TicketHistory.belongsTo(TicketEntity, {
    constraints: false,
    as: "ticket",
    foreignKey: "ticket_id",
  });

  TicketHistory.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });
};
