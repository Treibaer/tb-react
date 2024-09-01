import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { AccessToken } from "./models/access-token.js";
import { Board } from "./models/board.js";
import { ProjectEntity } from "./models/project.js";
import { TicketEntity } from "./models/ticket.js";
import { User } from "./models/user.js";
import boardsRoutes from "./routes/boards.js";
import projectsRoutes from "./routes/projects.js";
import ticketsRoutes from "./routes/tickets.js";
import UserService from "./services/UserService.js";
import { sequelize } from "./utils/database.js";
import { global } from "./utils/global.js";

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


const app = express();
app.use(express.json());

// CORS
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, PATCH, OPTIONS, DELETE, POST"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use((req, _, next) => {
  if (req.method !== "OPTIONS") {
    console.log(req.method, req.url);
  }
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static files
app.use("/", express.static(path.join(__dirname, "../public")));

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  const authorization = req.headers.authorization ?? "";
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  global.host = req.protocol + "://" + req.get("host");

  // clean user, prefetch all users
  // todo: move to a better place
  await UserService.shared.setup(authorization);

  return next();
});

const port = 3052;

app.use("/api/v3/projects", projectsRoutes);
app.use("/api/v3/projects", ticketsRoutes);
app.use("/api/v3/projects", boardsRoutes);

app.get("/api/v3/app", (_, res) => {
  res.json({ allowed: true });
});

app.get("/", async (_, res) => {
  res.json({ api: "running" });
});

sequelize.sync().then(() => {
  app.listen(port);
});
