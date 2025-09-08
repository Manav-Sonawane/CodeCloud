import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import pool from "../db.js";

const router = express.Router();

router.post("/save", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { filename, language, code } = req.body;

  if (!filename || !language || !code) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO codes (user_id, filename, language, code) VALUES (?, ?, ?, ?)",
      [userId, filename, language, code]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("DB Insert Error:", err);
    res.status(500).json({ error: "Failed to save code" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      "SELECT id, filename, language, created_at FROM codes WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("DB Select Error:", err);
    res.status(500).json({ error: "Failed to fetch codes" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM codes WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Code not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch code", details: error.message });
  }
});

export default router;
