import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import OpenAI from "openai"
import { validateApiRequest, chatRequestSchema, sanitizeString } from "@/lib/security"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  // Validate API request origin
  if (!validateApiRequest(req)) {
    console.warn('Unauthorized API request to chat endpoint:', {
      origin: req.headers.get('origin'),
      referer: req.headers.get('referer'),
      userAgent: req.headers.get('user-agent')?.slice(0, 100)
    });
    return NextResponse.json(
      { error: 'Unauthorized request' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    console.log('Chat API received request. Body keys:', Object.keys(body));
    console.log('Prompt length:', body.prompt?.length);
    
    // Validate and sanitize input
    const validationResult = chatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.warn('Invalid chat request:', validationResult.error.issues);
      return NextResponse.json(
        { error: 'Invalid request format', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { prompt, sysPrompt, messages } = validationResult.data;

    // Legacy support - sanitize prompt
    if (prompt) {
      const sanitizedPrompt = sanitizeString(prompt);
      console.log('Original prompt length:', prompt.length);
      console.log('Sanitized prompt length:', sanitizedPrompt.length);
      console.log('First 200 chars of sanitized prompt:', sanitizedPrompt.substring(0, 200));
      console.log('Last 200 chars of sanitized prompt:', sanitizedPrompt.substring(sanitizedPrompt.length - 200));
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: sanitizedPrompt }],
        max_tokens: 1000, // Limit response length
        temperature: 0.7,
      });
      
      console.log('OpenAI response received. Content type:', typeof completion.choices[0].message.content);
      console.log('OpenAI response first 200 chars:', completion.choices[0].message.content?.substring(0, 200));
      
      return NextResponse.json({ text: completion.choices[0].message.content });
    }

    // New structured call with validation
    if (!sysPrompt || !messages) {
      return NextResponse.json(
        { error: 'sysPrompt and messages are required for structured calls' },
        { status: 400 }
      );
    }

    // Sanitize all message content
    const sanitizedMessages = messages.map(msg => ({
      role: msg.role,
      content: sanitizeString(msg.content)
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: sanitizeString(sysPrompt) },
        ...sanitizedMessages,
      ],
      max_tokens: 1000, // Limit response length
      temperature: 0.7,
    });

    return NextResponse.json({ text: completion.choices[0].message.content });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Don't expose internal error details
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}