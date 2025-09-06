import express from "express";
import { runCode } from "../services/jdoodle.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  const { language, versionIndex, code, stdin } = req.body;

  if (!language || !versionIndex || !code) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await runCode(language, versionIndex, code);
    res.json(result);
  } catch (error) {
    console.error("JDoodle Error:", error);
    res
      .status(500)
      .json({ error: "Code execution failed.", details: error.message });
  }
});

export default router;
