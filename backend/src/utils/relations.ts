import { AccessToken } from "../models/access-token.js";
import { Board } from "../models/board.js";
import { AccountEntry } from "../models/finances/account-entry.js";
import { AccountTag } from "../models/finances/account-tag.js";
import { Account } from "../models/finances/account.js";
import { Project } from "../models/project.js";
import { TicketComment } from "../models/ticket-comment.js";
import { TicketHistory } from "../models/ticket-history.js";
import { Ticket } from "../models/ticket.js";
import { User } from "../models/user.js";

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

  AccountEntry.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });

  AccountEntry.belongsTo(Account, {
    constraints: false,
    as: "account",
    foreignKey: "account_id",
  });

  AccountEntry.belongsTo(AccountTag, {
    constraints: false,
    as: "tag",
    foreignKey: "tag_id",
  });

  TicketComment.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });

  TicketComment.belongsTo(Ticket, {
    constraints: false,
    as: "ticket",
    foreignKey: "ticket_id",
  });
};
