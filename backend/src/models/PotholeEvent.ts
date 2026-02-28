import mongoose from "mongoose";

const PotholeEventSchema = new mongoose.Schema(
  {
    timestamp: {
      type: String,
      required: true
    },

    source: {
      type: String,
      enum: ["live_detection", "manual_upload"],
      required: true
    },

    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true }
    },

    vision: {
      avg_depth_est_cm: { type: Number, required: true }
    },

    imu: {
      peak_z_cm_s2: { type: Number }
    },

    artifacts: {
      frames: [{ type: String }],
      depth_map: { type: String }
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "low"
    },

    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("PotholeEvent", PotholeEventSchema);
