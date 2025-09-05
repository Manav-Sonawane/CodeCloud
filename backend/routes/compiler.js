import express from "express";
import { runCode } from "../services/jdoodle.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  const { language, versionIndex, code } = req.body;

  try {
    const result = await runCode(language, versionIndex, code);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Code execution failed.", details: error.message });
  }
});

export default router;
