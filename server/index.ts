import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Log middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Different handling for development and production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // For production, especially on Vercel
    const publicPath = process.env.VERCEL 
      ? "./public"  // Vercel's serverless function structure
      : path.resolve(__dirname, "public");

    // Serve static files with proper caching
    app.use(express.static(publicPath, {
      maxAge: '1y',
      etag: true
    }));

    // API routes should be handled before the catch-all
    app.all("/api/*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        next();
      } else {
        res.status(404).json({ message: "API endpoint not found" });
      }
    });

    // SPA catch-all route - handle client-side routing
    app.get("*", (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"), {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    });
  }

  // Only start the server if not running on Vercel
  if (!process.env.VERCEL) {
    const PORT = Number(process.env.PORT) || 5000;
    server.listen(PORT, "0.0.0.0", () => {
      log(`serving on port ${PORT}`);
    });
  }
})();