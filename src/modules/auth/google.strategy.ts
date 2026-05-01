import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import UserModel from "../user/user.model";
import { logger } from "../../shared/utils/logger";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.SERVER_BASE_URL || "https://personal-hud-server.onrender.com"
    : "http://localhost:5000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${BASE_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Google account has no email"), undefined);

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = await UserModel.create({
            name: profile.displayName || email.split("@")[0],
            email,
            password: "", // OAuth users have no password
            avatar: profile.photos?.[0]?.value,
          });
          console.log(`New user registered via Google OAuth: ${email}`);
        }

        done(null, user);
      } catch (err) {
        console.log(`Google OAuth error: ${(err as Error).message}`);
        done(err as Error, undefined);
      }
    }
  )
);

export default passport;
