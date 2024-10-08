import { AccessToken } from "../models/access-token.js";
import { Board } from "../models/board.js";
import { AccountEntry } from "../models/finances/account-entry.js";
import { AccountTag } from "../models/finances/account-tag.js";
import { Account } from "../models/finances/account.js";
import { Page } from "../models/page.js";
import { PasswordEntryHistory } from "../models/passwords/password-entry-history.js";
import { PasswordEntry } from "../models/passwords/password-entry.js";
import { PasswordEnvironment } from "../models/passwords/password-environment.js";
import { Project } from "../models/project.js";
import { TicketComment } from "../models/ticket-comment.js";
import { TicketHistory } from "../models/ticket-history.js";
import { Ticket } from "../models/ticket.js";
import { User } from "../models/user.js";

export const createRelations = () => {
  AccessToken.belongsTo(User, {
    constraints: false,
    as: "user",
    foreignKey: "user_id",
  });

  Project.hasMany(Page, {
    as: "pages",
    foreignKey: "project_id",
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

  Page.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });

  Page.belongsTo(User, {
    constraints: false,
    as: "updator",
    foreignKey: "updator_id",
  });

  Page.belongsTo(Page, {
    constraints: false,
    as: "parent",
    foreignKey: "parent_id",
  });

  PasswordEnvironment.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });

  PasswordEnvironment.hasMany(PasswordEntry, {
    as: "entries",
    foreignKey: "environment_id",
  });

  PasswordEntry.belongsTo(User, {
    constraints: false,
    as: "creator",
    foreignKey: "creator_id",
  });

  PasswordEntryHistory.belongsTo(PasswordEntry, {
    constraints: false,
    as: "entry",
    foreignKey: "entry_id",
  });
};
