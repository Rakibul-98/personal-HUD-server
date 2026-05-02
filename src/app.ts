import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFoundHandler } from "./shared/middlewares/notFoundHandler";
import { errorHandler } from "./shared/middlewares/errorHandler";
import userRoutes from "./modules/user/user.route";
import feedRoutes from "./modules/feed/feed.route";
import bookmarkRoutes from "./modules/bookmark/bookmark.route";
import settingsRoutes from "./modules/settings/settings.route";
import focusRoutes from "./modules/focus/focus.route";
import googleAuthRoutes from "./modules/auth/auth.route";
import rssRoutes from "./modules/rss/rss.route";
import analyticsRoutes from "./modules/analytics/analytics.route";

const app: Application = express();

// ── Security ───────────────────────────────────────────────────────────────
// Note: install helmet with: npm install helmet
// import helmet from "helmet";
// app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://personal-hud-client.vercel.app",
      "https://hud.rakibulhasandev.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body parsing (with size limits to prevent payload attacks) ──────────────
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(cookieParser());

// ── Async error wrapper — eliminates try/catch in every controller ──────────
// Wraps async route handlers so thrown errors reach errorHandler automatically
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

// Make asyncHandler available on the app instance for routes to import
(app as any).asyncHandler = asyncHandler;

// ── Health check ───────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "personal-hud-server",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/sources", rssRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", googleAuthRoutes);

// ── Error handling (must be last) ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
