import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import UserModel from "../user/user.model";

const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://personal-hud-server.onrender.com/api/auth/google/callback"
    : "http://localhost:5000/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email from Google"), undefined);

        let user = await UserModel.findOne({ email });
        if (!user) {
          user = new UserModel({
            name: profile.displayName,
            email,
            password: "",
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);

export default passport;
