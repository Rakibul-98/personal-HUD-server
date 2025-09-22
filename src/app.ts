import express from "express";
import cors from "cors";
import { notFoundHandler } from "./shared/middlewares/notFoundHandler";
import { errorHandler } from "./shared/middlewares/errorHandler";
import userRoutes from "./modules/user/user.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/users", userRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
