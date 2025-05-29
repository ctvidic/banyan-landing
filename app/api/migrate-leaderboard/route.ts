import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Define the leaderboard entry type
type LeaderboardEntry = {
  id: string;
  name: string;
  totalReduction: number;
  timeInSeconds: number;
  timestamp: string;
};

const LEADERBOARD_KEY = "negotiation_leaderboard";

// Your existing leaderboard data
const existingData: LeaderboardEntry[] = [
  {
    "id": "1748544306196-b7jl9l9l8",
    "name": "Alex M",
    "totalReduction": 0,
    "timeInSeconds": 300,
    "timestamp": "2025-05-29T18:45:06.196Z"
  },
  {
    "id": "1748544312831-y1qk3mhym",
    "name": "Jack C",
    "totalReduction": 240,
    "timeInSeconds": 300,
    "timestamp": "2025-05-29T18:45:12.831Z"
  },
  {
    "id": "1748545324184-qk0060dzn",
    "name": "Cruce, Austin, Jackson",
    "totalReduction": 300,
    "timeInSeconds": 552,
    "timestamp": "2025-05-29T19:02:04.184Z"
  },
  {
    "id": "1748547426514-h5pv7cs7l",
    "name": "Sawyer, Zane",
    "totalReduction": 42,
    "timeInSeconds": 286,
    "timestamp": "2025-05-29T19:37:06.514Z"
  }
];

export async function POST() {
  try {
    // Check if data already exists
    const existingKvData = await kv.get<LeaderboardEntry[]>(LEADERBOARD_KEY);
    
    if (existingKvData && existingKvData.length > 0) {
      return NextResponse.json({ 
        message: "KV database already has data. Skipping migration.",
        existingEntries: existingKvData.length
      }, { status: 200 });
    }

    // Migrate data to KV
    await kv.set(LEADERBOARD_KEY, existingData);
    
    console.log(`✅ Migrated ${existingData.length} entries to KV database`);
    
    return NextResponse.json({ 
      message: `Successfully migrated ${existingData.length} entries to KV database`,
      entries: existingData.map(e => ({ name: e.name, totalReduction: e.totalReduction }))
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Migration error:", error);
    return NextResponse.json(
      { error: "Failed to migrate leaderboard data", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check current KV data
    const kvData = await kv.get<LeaderboardEntry[]>(LEADERBOARD_KEY);
    
    return NextResponse.json({ 
      message: "Current KV database status",
      kvEntries: kvData?.length || 0,
      data: kvData || [],
      localDataToMigrate: existingData.length
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Check error:", error);
    return NextResponse.json(
      { error: "Failed to check KV data", details: error.message },
      { status: 500 }
    );
  }
} 