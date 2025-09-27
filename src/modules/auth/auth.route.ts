import { Router } from "express";
import passport from "./google.strategy";
import jwt from "jsonwebtoken";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as any;

    const role = user.role || "user";

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const userForFrontend = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role,
    };

    const FRONTEND_URL =
      process.env.NODE_ENV === "production"
        ? "https://personal-hud-client.vercel.app"
        : "http://localhost:3000";

    const redirectUrl = `${FRONTEND_URL}/google-success?token=${token}&user=${encodeURIComponent(
      JSON.stringify(userForFrontend)
    )}`;

    res.redirect(redirectUrl);
  }
);

export default router;
