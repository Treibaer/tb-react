import { User } from "../models/user.js";
import { Project } from "../models/project.js";
import { AccessToken } from "../models/access-token.js";
import { Ticket } from "../models/ticket.js";
import { Board } from "../models/board.js";
import { TicketHistory } from "../models/ticket-history.js";

export const createRelations = () => {
  Project.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });
  User.hasMany(Project, {
    as: "projects",
    foreignKey: "creator_id",
  });

  AccessToken.belongsTo(User, {
    constraints: false,
    as: "user",
    foreignKey: "user_id",
  });

  Project.hasMany(Ticket, {
    as: "tickets",
    foreignKey: "project_id",
  });

  Ticket.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });

  Ticket.belongsTo(User, {
    constraints: false,
    as: "assignee",
    foreignKey: "assigned_id",
  });

  Ticket.belongsTo(Board, {
    constraints: false,
    as: "board",
    foreignKey: "board_id",
  });

  Board.belongsTo(Project, {
    constraints: false,
    as: "project",
    foreignKey: "project_id",
  });

  Board.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });
  
  TicketHistory.belongsTo(Ticket, {
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
