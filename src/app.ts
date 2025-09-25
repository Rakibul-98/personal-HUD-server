import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFoundHandler } from "./shared/middlewares/notFoundHandler";
import { errorHandler } from "./shared/middlewares/errorHandler";
import userRoutes from "./modules/user/user.route";
import feedRoutes from "./modules/feed/feed.route";
import bookmarkRoutes from "./modules/bookmark/bookmark.route";
import settingsRoutes from "./modules/settings/settings.route";
import focusRoutes from "./modules/focus/focus.route";
import { Request, Response } from "express";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://personal-hud-client.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/users", userRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/focus", focusRoutes);

app.use(errorHandler);
app.use(notFoundHandler);

export default app;
