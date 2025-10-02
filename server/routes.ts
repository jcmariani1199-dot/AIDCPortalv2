import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Extend session type
declare module "express-session" {
  interface SessionData {
    isAuthenticated?: boolean;
    username?: string;
  }
}

const VALID_USERNAME = "Nokia";
const VALID_PASSWORD = "qIdhed-hoccek-zukwe1";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      req.session.isAuthenticated = true;
      req.session.username = username;
      res.json({ success: true, username });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, message: "Logout failed" });
      } else {
        res.json({ success: true });
      }
    });
  });

  app.get("/api/auth/check", (req: Request, res: Response) => {
    if (req.session.isAuthenticated) {
      res.json({ authenticated: true, username: req.session.username });
    } else {
      res.json({ authenticated: false });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
