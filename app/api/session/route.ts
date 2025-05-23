import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Vercel /api/session: OPENAI_API_KEY environment variable is NOT SET.");
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }

    // Debug logs for Vercel
    console.log(`Vercel /api/session: API Key raw length: ${apiKey.length}`);
    const trimmedApiKey = apiKey.trim();
    console.log(`Vercel /api/session: API Key trimmed length: ${trimmedApiKey.length}`);
    console.log(`Vercel /api/session: API Key starts with: '${trimmedApiKey.substring(0, 10)}'`); // Show first few chars e.g. sk-proj-Xk
    console.log(`Vercel /api/session: API Key ends with: '${trimmedApiKey.substring(trimmedApiKey.length - 6)}'`); // Show last few chars e.g. zbTw7c
    if (apiKey !== trimmedApiKey) {
      console.warn("Vercel /api/session: API Key had leading/trailing whitespace!");
    }
    if (trimmedApiKey.includes('"') || trimmedApiKey.includes("'")) {
      console.warn("Vercel /api/session: API Key might contain quotes after trimming!");
    }
    // End Debug logs

    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${trimmedApiKey}`, // Use the trimmed key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17", // As per the example, confirm if model name needs update from OpenAI docs
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error from OpenAI API: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch session token from OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/session route:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 