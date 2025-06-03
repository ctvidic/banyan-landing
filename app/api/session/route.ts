import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { validateApiRequest, getClientIdentifier } from "@/lib/security";

// Enhanced session limits with stricter controls
const SESSION_LIMIT_PER_IP = 10; // Max 10 sessions per hour per IP
const SESSION_LIMIT_PER_DAY = 50; // Max 50 sessions per day per IP

// Track sessions per IP with both hourly and daily limits
const activeSessions = new Map<string, { hourlyCount: number; dailyCount: number; hourlyReset: number; dailyReset: number }>();

function getClientIP(request: NextRequest): string {
  return getClientIdentifier(request); // Reuse the existing function
}

function checkSessionLimit(clientIP: string): boolean {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  
  const session = activeSessions.get(clientIP);
  
  if (!session || now > session.dailyReset) {
    // Reset both counters
    activeSessions.set(clientIP, {
      hourlyCount: 1,
      dailyCount: 1,
      hourlyReset: now + hourMs,
      dailyReset: now + dayMs
    });
    return true;
  }
  
  // Check daily limit first
  if (session.dailyCount >= SESSION_LIMIT_PER_DAY) {
    return false;
  }
  
  // Reset hourly counter if needed
  if (now > session.hourlyReset) {
    session.hourlyCount = 1;
    session.hourlyReset = now + hourMs;
  } else {
    // Check hourly limit
    if (session.hourlyCount >= SESSION_LIMIT_PER_IP) {
      return false;
    }
    session.hourlyCount++;
  }
  
  session.dailyCount++;
  return true;
}

// Clean up every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, session] of activeSessions.entries()) {
    if (now > session.dailyReset) {
      activeSessions.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export async function GET(request: NextRequest) {
  try {
    // Validate API request origin
    if (!validateApiRequest(request)) {
      console.warn('Unauthorized session request:', {
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent')?.slice(0, 100)
      });
      return NextResponse.json(
        { error: 'Unauthorized request' },
        { status: 401 }
      );
    }

    // Check rate limit
    const clientIP = getClientIP(request);
    if (!checkSessionLimit(clientIP)) {
      console.warn(`Session limit exceeded for IP: ${clientIP}`);
      return NextResponse.json(
        { 
          error: "Session limit exceeded", 
          message: "You've reached the maximum number of practice sessions. Please try again later.",
          limits: {
            hourly: SESSION_LIMIT_PER_IP,
            daily: SESSION_LIMIT_PER_DAY
          }
        },
        { status: 429 }
      );
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY environment variable is not set.");
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    // Make request to OpenAI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
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
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error from OpenAI API: ${response.status} ${response.statusText}`, errorBody);
        
        // Don't expose OpenAI error details to client
        return NextResponse.json(
          { error: "Unable to create session. Please try again." },
          { status: 503 }
        );
      }

      const data = await response.json();
      
      // Log session creation for monitoring (without sensitive data)
      console.log(`Session created for IP: ${clientIP}, Total sessions: ${activeSessions.get(clientIP)?.dailyCount || 1}`);
      
      return NextResponse.json(data);
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
    
  } catch (error) {
    console.error("Error in /api/session route:", error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timeout. Please try again." },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 