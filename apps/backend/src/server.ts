import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import residentsRoutes from "./routes/residents.routes";
import vaccinationsRoutes from "./routes/vaccinations.routes";
import stockRoutes from "./routes/stock.routes";
import analyticsRoutes from "./routes/analytics.routes";
import schedulesRoutes from "./routes/schedules.routes";
import notificationsRoutes from "./routes/notifications.routes";
import usersRoutes from "./routes/users.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/residents", residentsRoutes);
// Nested: /api/residents/:id/vaccinations
app.use("/api/residents/:id/vaccinations", vaccinationsRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/schedules", schedulesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/users", usersRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`VaxCare backend running on http://localhost:${PORT}`);
});
