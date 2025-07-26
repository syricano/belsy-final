import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const [user] = await User.findOrCreate({
        where: { email },
        defaults: {
          firstName: profile.name?.givenName || 'Google',
          lastName: profile.name?.familyName || 'User',
          phone: '0000000000',
          password: 'OAuthGoogle',
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
