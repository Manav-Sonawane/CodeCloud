import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      fullname,
      username,
      email,
      password,
      age,
      gender,
      jobRole,
      institution,
      phone,
    } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use fullname as username if fullname is provided (frontend sends fullname)
    const finalUsername = fullname || username;

    await pool.query(
      "INSERT INTO users (username, email, password, age, gender, job_role, institution, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        finalUsername,
        email,
        hashedPassword,
        age,
        gender,
        jobRole,
        institution,
        phone,
      ]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration Failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login Failed" });
  }
});

export default router;
