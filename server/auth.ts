import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Interface pour l'utilisateur admin
interface AdminUser {
  id: number;
  username: string;
}

const crypto = {
  async compare(suppliedPassword: string, storedPassword: string) {
    const salt = process.env.ADMIN_SALT || 'default-salt';
    const suppliedPasswordBuf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    const storedPasswordBuf = (await scryptAsync(storedPassword, salt, 64)) as Buffer;
    return timingSafeEqual(storedPasswordBuf, suppliedPasswordBuf);
  }
};

declare global {
  namespace Express {
    interface User extends AdminUser { }
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || "bingo-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      secure: true,
    };
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Utiliser les variables d'environnement pour l'authentification
  const adminUser: AdminUser = {
    id: 1,
    username: process.env.ADMIN_USERNAME || 'admin'
  };

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        if (username !== process.env.ADMIN_USERNAME) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isMatch = await crypto.compare(password, process.env.ADMIN_PASSWORD || '');
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, adminUser);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    if (id === adminUser.id) {
      done(null, adminUser);
    } else {
      done(new Error("User not found"));
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: { message: string }) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).send(info.message);
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.json({
          message: "Login successful",
          user: { id: user.id, username: user.username },
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send("Logout failed");
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).send("Not logged in");
  });
}