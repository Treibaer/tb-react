import express from "express";
import fs from 'fs';
import https from 'https';

import boardsRoutes from "./routes/boards.js";
import projectsRoutes from "./routes/projects.js";
import ticketsRoutes from "./routes/tickets.js";
import Client from "./services/Client.js";

const app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/treibaer.de/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/treibaer.de/cert.pem', 'utf8');

const options = {
  key: privateKey,
  cert: certificate
};


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

const port = process.env.PORT || 5000;

app.use("/api/v3/projects", projectsRoutes);
app.use("/api/v3/projects", ticketsRoutes);
app.use("/api/v3/projects", boardsRoutes);

app.get("/api/v3/app", (_, res) => {
  res.json({ allowed: true });
});

app.get("/", (_, res) => {
  res.json({ api: "running" });
});



https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
