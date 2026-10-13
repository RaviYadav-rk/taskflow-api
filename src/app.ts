import express from "express";

import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is running",
  });
});

app.use("/api/tasks", taskRoutes);

export default app;
