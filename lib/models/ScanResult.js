import mongoose from "mongoose";

const ScanResultSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image"],
      required: true
    },
    input: {
      type: String,
      required: true
    },
    risk_score: {
      type: Number,
      required: true
    },
    verdict: {
      type: String,
      enum: ["SAFE", "SCAM"],
      required: true
    },
    reasoning: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
);

export default mongoose.models.ScanResult ||
  mongoose.model("ScanResult", ScanResultSchema);
