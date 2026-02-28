import express from "express";
import PotholeEvent from "../models/PotholeEvent";

const router = express.Router();

/**
 * Priority logic based on depth (cm)
 */
function calculatePriority(depth: number): "high" | "medium" {
  if (depth >= 8) return "high";
  return "medium";
}

/**
 * Store pothole event into MongoDB
 * Rules:
 *  - depth <= 4  → IGNORE
 *  - depth > 4   → STORE
 *  - priority assigned here
 */
router.post("/events", async (req, res) => {
  try {
    const depth: number | undefined =
      req.body?.vision?.avg_depth_est_cm;

    // 🛑 HARD FILTER
    if (depth === undefined || depth <= 4) {
      console.log(`ℹ️ Event ignored (depth=${depth})`);
      return res.status(200).json({
        message: "Event ignored (depth <= 4cm)"
      });
    }

    const priority = calculatePriority(depth);

    const event = await PotholeEvent.create({
      ...req.body,
      priority
    });

    console.log(
      `✅ Event stored | depth=${depth}cm | priority=${priority}`
    );

    res.status(201).json({
      message: "Event stored successfully",
      event
    });
  } catch (error) {
    console.error("❌ Failed to store event", error);
    res.status(500).json({ message: "Failed to store event" });
  }
});

/**
 * Get pothole events for Priority Queue UI
 * Sorted by:
 *  1. Priority (high → medium)
 *  2. Depth (higher first)
 */
router.get("/events", async (req, res) => {
  try {
    const events = await PotholeEvent.find().sort({
      priority: -1,
      "vision.avg_depth_est_cm": -1
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Failed to fetch events", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

export default router;
