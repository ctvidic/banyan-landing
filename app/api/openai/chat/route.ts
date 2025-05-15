import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",  // or "gpt-4o" depending on your access
    messages: [{ role: "user", content: prompt }],
  })

  // Return the assistant’s reply as plain JSON
  return NextResponse.json({ text: completion.choices[0].message.content })
}