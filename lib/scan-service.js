import { connectToDatabase } from "@/lib/mongodb";
import ScanResult from "@/lib/models/ScanResult";

export async function saveScanResult(payload) {
  try {
    await connectToDatabase();

    if (!process.env.MONGODB_URI) {
      return null;
    }

    const created = await ScanResult.create(payload);
    return created;
  } catch (error) {
    console.error("Failed to save scan result:", error);
    return null;
  }
}

export async function getRecentScans(limit = 12) {
  try {
    await connectToDatabase();

    if (!process.env.MONGODB_URI) {
      return [];
    }

    const scans = await ScanResult.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return scans.map((scan) => ({
      ...scan,
      _id: String(scan._id),
      createdAt: scan.createdAt?.toISOString?.() ?? scan.createdAt
    }));
  } catch (error) {
    console.error("Failed to fetch scan history:", error);
    return [];
  }
}
