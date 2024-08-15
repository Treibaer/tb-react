
import express from "express";
import projectsRoutes from "./routes/projects.js";

const app = express();
app.use(express.json());

// CORS
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const port = 3052;

app.get("/", (_, res) => {
  res.status(200).json({ message: "Hello from express" });
});
app.use("/api/projects", projectsRoutes);

app.listen(port);
