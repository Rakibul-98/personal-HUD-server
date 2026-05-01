import { Router, Request, Response } from "express";
import passport from "./google.strategy";
import jwt from "jsonwebtoken";
import { env } from "../../shared/config/env";

const router = Router();

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://hud.rakibulhasandev.com"
    : "http://localhost:3000";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "user" },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    // Set as httpOnly cookie — never expose JWT in URL (visible in server logs, referrer headers)
    res.cookie("token", token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect cleanly — no token in the URL
    res.redirect(`${FRONTEND_URL}/feed`);
  }
);

export default router;
