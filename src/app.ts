import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { notFoundHandler } from "./shared/middlewares/notFoundHandler";
import { errorHandler } from "./shared/middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(compression());

app.get("/", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
