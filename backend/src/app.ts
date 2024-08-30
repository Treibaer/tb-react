
import express from "express";
import projectsRoutes from "./routes/projects.js";
import Client from "./services/Client.js";

const app = express();
app.use(express.json());

app.use((req, _, next) => {
  // get the token from the request headers
  const token = req.headers.authorization;
  // set the token on the client
  Client.token = token ?? "";
  next();
});

// CORS
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, OPTIONS, DELETE, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

const port = 3052;

app.use("/api/v3/projects", projectsRoutes);

app.get("/api/v3/app", (_, res) => {
  res.json({ allowed: true });
});

app.listen(port);
