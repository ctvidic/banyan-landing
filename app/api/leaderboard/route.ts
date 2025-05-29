import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { kv } from "@vercel/kv";

// Define the expected request body schema for POST
const leaderboardEntrySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  totalReduction: z.number().min(0, "Total reduction must be non-negative"),
  timeInSeconds: z.number().min(1, "Time must be positive"),
});

// Define the leaderboard entry type
export type LeaderboardEntry = {
  id: string;
  name: string;
  totalReduction: number;
  timeInSeconds: number;
  timestamp: string;
};

// Define the directory and file path for storing leaderboard data (fallback for local dev)
const dataDir = path.join(process.cwd(), '.vercel', 'output'); 
const filePath = path.join(dataDir, "leaderboard.json");

// KV storage key
const LEADERBOARD_KEY = "negotiation_leaderboard";

async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function readLeaderboardData(): Promise<LeaderboardEntry[]> {
  // Try KV storage first (for production)
  if (process.env.KV_REST_API_URL) {
    try {
      console.log("Reading from KV storage...");
      const data = await kv.get<LeaderboardEntry[]>(LEADERBOARD_KEY);
      return data || [];
    } catch (error) {
      console.error("KV read error, falling back to file system:", error);
    }
  }

  // Fallback to file system (for local development)
  try {
    console.log("Reading from file system...");
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
}

async function writeLeaderboardData(data: LeaderboardEntry[]): Promise<void> {
  // Try KV storage first (for production)
  if (process.env.KV_REST_API_URL) {
    try {
      console.log("Writing to KV storage...");
      await kv.set(LEADERBOARD_KEY, data);
      return;
    } catch (error) {
      console.error("KV write error, falling back to file system:", error);
    }
  }

  // Fallback to file system (for local development)
  console.log("Writing to file system...");
  await ensureDirectoryExists(dataDir);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries.sort((a, b) => {
    // Primary sort: highest total reduction wins
    if (a.totalReduction !== b.totalReduction) {
      return b.totalReduction - a.totalReduction;
    }
    // Tiebreaker: lowest time wins
    return a.timeInSeconds - b.timeInSeconds;
  });
}

// GET endpoint - retrieve leaderboard
export async function GET() {
  try {
    const entries = await readLeaderboardData();
    const sortedEntries = sortLeaderboard(entries);
    
    // Add rank to each entry
    const rankedEntries = sortedEntries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    return NextResponse.json({ 
      leaderboard: rankedEntries,
      count: rankedEntries.length 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Leaderboard GET Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve leaderboard data." },
      { status: 500 }
    );
  }
}

// POST endpoint - add new leaderboard entry
export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validation = leaderboardEntrySchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation Error:", validation.error.flatten());
      return NextResponse.json(
        { error: "Invalid leaderboard entry data.", details: validation.error.flatten() },
        { status: 400 }
      );
    }
    
    const { name, totalReduction, timeInSeconds } = validation.data;

    // Read existing data
    const entries = await readLeaderboardData();

    // Create new entry
    const newEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      totalReduction,
      timeInSeconds,
      timestamp: new Date().toISOString(),
    };

    // Add new entry and save
    entries.push(newEntry);
    await writeLeaderboardData(entries);

    // Return the new entry with its rank
    const sortedEntries = sortLeaderboard(entries);
    const rank = sortedEntries.findIndex(e => e.id === newEntry.id) + 1;

    console.log(`New leaderboard entry added: ${name} - $${totalReduction} total reduction in ${timeInSeconds}s (Rank: ${rank})`);

    return NextResponse.json({ 
      success: true, 
      entry: { ...newEntry, rank },
      message: `Added to leaderboard at rank ${rank}!`
    }, { status: 201 });

  } catch (error: any) {
    console.error("Leaderboard POST Error:", error);
    
    let errorMessage = "Failed to add entry to leaderboard. Please try again later.";
    let statusCode = 500;

    if (error instanceof z.ZodError) {
      errorMessage = "Invalid data format.";
      statusCode = 400;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 