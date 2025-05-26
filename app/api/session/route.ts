import { NextResponse } from "next/server";

// Simple in-memory session tracking (replace with Redis in production)
const activeSessions = new Map<string, { count: number; lastAccess: number }>();
const SESSION_LIMIT_PER_IP = 3; // Max 3 sessions per hour per IP
const SESSION_WINDOW = 60 * 60 * 1000; // 1 hour

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

function checkSessionLimit(clientIP: string): boolean {
  const now = Date.now();
  const session = activeSessions.get(clientIP);
  
  if (!session || now - session.lastAccess > SESSION_WINDOW) {
    activeSessions.set(clientIP, { count: 1, lastAccess: now });
    return true;
  }
  
  if (session.count >= SESSION_LIMIT_PER_IP) {
    return false;
  }
  
  session.count++;
  session.lastAccess = now;
  return true;
}

// Clean up old sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, session] of activeSessions.entries()) {
    if (now - session.lastAccess > SESSION_WINDOW) {
      activeSessions.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export async function GET(request: Request) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    if (!checkSessionLimit(clientIP)) {
      console.warn(`Session limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { 
          error: "Session limit exceeded", 
          message: "You've reached the maximum number of practice sessions. Please try again later." 
        },
        { status: 429 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }

    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error from OpenAI API: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch session token from OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Log session creation for monitoring
    console.log(`Session created for IP: ${clientIP}, Total sessions: ${activeSessions.get(clientIP)?.count || 1}`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/session route:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 