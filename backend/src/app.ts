import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import boardsRoutes from "./routes/boards.js";
import projectsRoutes from "./routes/projects.js";
import statusRoutes from "./routes/status.js";
import ticketsRoutes from "./routes/tickets.js";
import UserService from "./services/UserService.js";
import { sequelize } from "./utils/database.js";
import { global } from "./utils/global.js";
import { createRelations } from "./utils/relations.js";

createRelations();

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

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  } else {
    // log request
    console.log(req.method, req.url);
    return next();
  }
});

// validation for production
// app.use(header("client").notEmpty().withMessage("header missing"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve static files
app.use("/", express.static(path.join(__dirname, "../public")));

// auth middleware
app.use(async (req, res, next) => {
  const authorization = req.headers.authorization ?? "";
  if (!authorization) {
    return res.status(401).json({ message: "not authenticated" });
  }
  global.host = req.protocol + "://" + req.get("host");
  try {
    await UserService.shared.setup(authorization);
  } catch (error) {
    return res.status(403).json({ message: "not authorized" });
  }
  return next();
});

const port = process.env.PORT || 3052;

app.use("/api/v3", authRoutes);
app.use("/api/v3/projects", projectsRoutes);
app.use("/api/v3/projects", ticketsRoutes);
app.use("/api/v3/projects", boardsRoutes);
app.use("/api/v3", statusRoutes);

app.get("/api/v3/app", (_, res) => {
  res.json({ allowed: true });
});

app.get("/", async (_, res) => {
  res.json({ api: "running" });
});

app.use((error: any, _: any, res: any, __: any) => {
  console.error(error);
  res
    .status(error.status ?? 500)
    .json({ message: error.message ?? "Internal server error" });
});

const development = true;
if (development) {
  startDevServer();
} else {
  startProdServer();
}

function startDevServer() {
  // Status.sync();
  sequelize.sync().then(() => {
    app.listen(port);
  });
}

function startProdServer() {
  const path = "/etc/letsencrypt/live/treibaer.de/";
  const privateKey = fs.readFileSync(`${path}/privkey.pem`, "utf8");
  const certificate = fs.readFileSync(`${path}/cert.pem`, "utf8");

  const options = {
    key: privateKey,
    cert: certificate,
  };

  sequelize.sync().then(() => {
    https.createServer(options, app).listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
}
