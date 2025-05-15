import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  /*  
      The client now sends:
         { sysPrompt: string; messages: {role:"user"|"assistant",content:string}[] }
      …but if someone still posts {prompt:string} we fall back.
  */
  const body = await req.json()

  // Legacy support
  if (body.prompt) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: body.prompt }],
    })
    return NextResponse.json({ text: completion.choices[0].message.content })
  }

  // New structured call
  const { sysPrompt, messages } = body
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",                    // cheaper & faster; change if you like
    messages: [
      { role: "system", content: sysPrompt },
      ...messages,
    ],
  })

  return NextResponse.json({ text: completion.choices[0].message.content })
}