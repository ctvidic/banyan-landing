// app/api/openai/transcribe/route.ts
import { NextResponse } from "next/server"
import OpenAI, { toFile } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const formData = await req.formData()
  const fileBlob = formData.get("file") as Blob
  const model    = formData.get("model") as string

  // 1. Read into a Buffer
  const arrayBuffer = await fileBlob.arrayBuffer()
  const buffer      = Buffer.from(arrayBuffer)

  // 2. Wrap in a File-like for the SDK
  const audioFile = await toFile(
    buffer,
    "audio.webm",                 // any extension matching your container
    { contentType: fileBlob.type } // e.g. "audio/webm"
  )

  // 3. Call the transcription endpoint
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model
  })

  return NextResponse.json({ text: transcription.text })
}