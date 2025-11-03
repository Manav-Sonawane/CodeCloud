import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import compilerRoutes from "./routes/compiler.js";
import codeRoutes from "./routes/codeRoutes.js";
import pool from "./db.js";
import { verifyToken } from "./middleware/authMiddleware.js";

// Load environment variables (for local development)
// On Render, the dashboard env vars will automatically be available
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend (React/Vue/HTML) from the frontend folder
app.use(express.static("./frontend"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/code", codeRoutes);

// Test database connection
async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to the database!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

testDBConnection();

// Ping route to check server + database
app.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ message: "pong", db_time: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Protected route example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: `Hello user ${req.user.id}, you accessed a protected route!`,
  });
});

// Catch-all for frontend SPA routing
app.get(/.*/, (req, res) => {
  res.sendFile("index.html", { root: "./frontend" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
