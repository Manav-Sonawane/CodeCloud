import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import pool from "./db.js";
import compilerRoutes from "./routes/compiler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/compiler", compilerRoutes);

app.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ message: "pong", db_time: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

import { verifyToken } from "./middleware/authMiddleware.js";

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: `Hello user ${req.user.id}, you accessed a protected route!`,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
