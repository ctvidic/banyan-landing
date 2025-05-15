import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { model, voice, input, response_format } = await req.json()

  // Call the new TTS endpoint
  const audioRes = await openai.audio.speech.create({
    model,
    voice,
    input,
    response_format, // "mp3" or "pcm"
  })

  // audioRes is a ReadableStream of bytes
  const arrayBuffer = await audioRes.arrayBuffer()
  return new Response(arrayBuffer, {
    headers: { "Content-Type": response_format === "pcm" ? "audio/wav" : "audio/mpeg" }
  })
}