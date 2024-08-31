import express from "express";
import projectsRoutes from "./routes/projects.js";
import ticketsRoutes from "./routes/tickets.js";
import boardsRoutes from "./routes/boards.js";
import Client from "./services/Client.js";

const app = express();
app.use(express.json());

app.use((req, _, next) => {
  Client.token = req.headers.authorization ?? "";
  next();
});

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

const port = 3052;

app.use("/api/v3/projects", projectsRoutes);
app.use("/api/v3/projects", ticketsRoutes);
app.use("/api/v3/projects", boardsRoutes);

app.get("/api/v3/app", (_, res) => {
  res.json({ allowed: true });
});

app.get("/", (_, res) => {
  res.json({ api: "running" });
});

app.listen(port);
