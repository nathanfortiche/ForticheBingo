import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js"; // Add .js extension for ESM compatibility
import { setupVite, serveStatic, log } from "./vite.js"; // Add .js for consistency
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes first before any middleware
const server = registerRoutes(app);

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
      log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message, error: String(err) });
});

async function setupServer() {
  if (app.get("env") === "development") {
    // In development, we need to set up Vite's dev server
    await setupVite(app, server);
  } else {
    // In production/serverless, we serve static files
    const publicPath = process.env.VERCEL 
      ? path.join(process.cwd(), 'dist', 'public')
      : path.resolve(__dirname, "public");

    app.use(express.static(publicPath, {
      maxAge: '1d',
      etag: true,
      index: false
    }));

    // Handle client-side routing for non-API routes
    app.get(/^(?!\/?api\/).+/, (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"), {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    });
  }

  return app;
}

// For local development
if (!process.env.VERCEL) {
  setupServer().then(app => {
    const PORT = Number(process.env.PORT) || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      log(`serving on port ${PORT}`);
    });
  });
}

// For Vercel serverless deployment
export default async function handler(req: Request, res: Response) {
  try {
    const app = await setupServer();
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}