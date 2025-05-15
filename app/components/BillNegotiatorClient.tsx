// components/BillNegotiatorClient.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, ArrowLeft, Mic, Square } from "lucide-react"

type Message = {
  id: string
  role: "agent" | "user"
  text: string
}

type ScenarioState = {
  id: string
  agent: string
  expect: string | string[]
  next: ((intent: string) => string) | string | null
}

const scenario: ScenarioState[] = [
  {
    id: "greeting",
    agent: "Hello, thank you for calling customer service. May I have your name, please?",
    expect: "name",
    next: "explain_issue",
  },
  {
    id: "explain_issue",
    agent: "Thank you, [name]. Can you please explain the issue you're experiencing?",
    expect: "issue",
    next: "explain_bill",
  },
  {
    id: "explain_bill",
    agent:
      "I see your bill increased because your 12-month promotional rate expired. Is there anything else I can help with?",
    expect: ["loyalty", "misled", "escalate"],
    next: (intent: string) => {
      if (intent === "escalate") return "supervisor"
      if (intent === "loyalty" || intent === "misled") return "resolution"
      return "explain_bill"
    },
  },
  {
    id: "supervisor",
    agent:
      "This is the supervisor. I understand you're concerned about your bill. Let me see what I can do.",
    expect: "final",
    next: "resolution",
  },
  {
    id: "resolution",
    agent:
      "Thank you for your patience. I can offer you a $15 discount for the next 6 months. Does that sound good?",
    expect: "end",
    next: null,
  },
]

export default function BillNegotiatorClient() {
  const [phase, setPhase] = useState<"intro" | "scenario" | "call" | "report">(
    "intro"
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStateId, setCurrentStateId] = useState("greeting")
  const [isRecording, setIsRecording] = useState(false)
  const [reportJson, setReportJson] = useState<any>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const PROB_IMPROVISE = 0.3

  useEffect(() => {
    if (phase === "call" && messages.length === 0) {
      const first = scenario.find((s) => s.id === "greeting")!
      pushAgentMessage(first.agent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const pushAgentMessage = async (text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "agent", text }])
    await speak(text)
  }

  const pushUserMessage = (text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text }])
  }

  // RECORD -> STT
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm; codecs=opus" })
    mediaRecorderRef.current = mr
    chunksRef.current = []

    mr.ondataavailable = (e) => chunksRef.current.push(e.data)
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" })
      const text = await transcribe(blob)
      pushUserMessage(text)
      await handleTurn(text)
    }

    mr.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const transcribe = async (blob: Blob): Promise<string> => {
    const formData = new FormData()
    formData.append("file", blob, "audio.webm")
    formData.append("model", "gpt-4o-mini-transcribe") // updated model

    const res = await fetch("/api/openai/transcribe", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    return data.text as string
  }

  const detectIntent = (text: string): string => {
    const t = text.toLowerCase()
    if (/supervisor|manager/.test(t)) return "escalate"
    if (/loyal|been with you/.test(t)) return "loyalty"
    if (/did(?:n't| not) know/.test(t)) return "misled"
    if (currentStateId === "greeting") return "name"
    if (currentStateId === "explain_issue") return "issue"
    if (currentStateId === "supervisor") return "final"
    return "unknown"
  }

  const handleTurn = async (userText: string) => {
    const intent = detectIntent(userText)
    const state = scenario.find((s) => s.id === currentStateId)!

    let nextId: string | null
    if (typeof state.next === "function") {
      nextId = state.next(intent)
    } else {
      nextId = state.next
    }

    if (!nextId) {
      await pushAgentMessage("Thank you for calling. Have a great day!")
      await scoreConversation()
      setPhase("report")
      return
    }

    setCurrentStateId(nextId)
    const nextState = scenario.find((s) => s.id === nextId)!
    const agentText =
      Math.random() < PROB_IMPROVISE
        ? await improvise(nextState.agent)
        : nextState.agent
    await pushAgentMessage(agentText)
  }

  const improvise = async (script: string): Promise<string> => {
    const res = await fetch("/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `Paraphrase: "${script}" in ≤2 sentences.` }),
    })
    const data = await res.json()
    return data.text?.trim() ?? script
  }

  const speak = async (text: string) => {
    const res = await fetch("/api/openai/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts", // updated model
        voice: "coral",
        input: text,
        response_format: "mp3",
      }),
    })
    const buf = await res.arrayBuffer()
    const audio = new Audio(
      URL.createObjectURL(new Blob([buf], { type: "audio/mpeg" }))
    )
    await audio.play()
  }

  const scoreConversation = async () => {
    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n")
    const res = await fetch("/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `You are a negotiation coach. Based on this transcript, return JSON with strengths[], improvements[], outcome:\n\n${transcript}`,
      }),
    })
    const data = await res.json()
    setReportJson(data)
  }

  const renderMessages = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 h-96 overflow-y-auto">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`${
            m.role === "agent" ? "bg-gray-200" : "bg-emerald-100"
          } rounded-lg p-4 mb-4 max-w-[80%]`}
        >
          <p className="text-gray-800 whitespace-pre-wrap">{m.text}</p>
        </div>
      ))}
    </div>
  )

  const renderIntro = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        Bill Negotiator Simulator
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Practice your negotiation skills in this interactive simulation. You'll
        be given a scenario and will negotiate with a customer service
        representative to resolve your issue.
      </p>
      <Button
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
        onClick={() => setPhase("scenario")}
      >
        Get Started
      </Button>
    </div>
  )

  const scenarioMeta = {
    title: "Unexpected Internet Bill Increase",
    description:
      "You notice your internet bill has increased from $69 to $89 per month without any prior notification. You're calling customer service to get this resolved.",
    goal:
      "Try to get your bill reduced back to the original price or negotiate for additional services to justify the price increase.",
  }

  const renderScenario = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{scenarioMeta.title}</h1>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Scenario</h2>
        <p className="text-gray-700 mb-4">{scenarioMeta.description}</p>
        <h3 className="text-lg font-semibold mb-2">Your Goal</h3>
        <p className="text-gray-700">{scenarioMeta.goal}</p>
      </div>
      <Button
        size="lg"
        className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
        onClick={() => setPhase("call")}
      >
        Start Call
      </Button>
    </div>
  )

  const renderCall = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Live Call</h1>
      {renderMessages()}
      <div className="flex gap-4 items-center">
        <Button
          variant="outline"
          className="rounded-full flex items-center gap-2"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}{" "}
          {isRecording ? "Stop" : "Speak"}
        </Button>
        <Button
          variant="secondary"
          className="rounded-full"
          onClick={() => {
            const typed = prompt("Type your response:") || ""
            if (typed.trim()) {
              pushUserMessage(typed)
              handleTurn(typed)
            }
          }}
        >
          Type Instead
        </Button>
        <Button variant="ghost" onClick={async () => await scoreConversation()}>
          End Call
        </Button>
      </div>
    </div>
  )

  const renderReport = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Negotiation Report</h1>
      {reportJson ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Performance Analysis</h2>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Negotiation Strengths</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {reportJson.strengths?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              Areas for Improvement
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {reportJson.improvements?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Outcome</h3>
            <p className="text-gray-700">{reportJson.outcome}</p>
          </div>
        </div>
      ) : (
        <p>Loading report…</p>
      )}
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  )

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-gray-100/20">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
              Banyan
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-16 flex-grow">
        <div className="container">
          {phase === "intro" && renderIntro()}
          {phase === "scenario" && renderScenario()}
          {phase === "call" && renderCall()}
          {phase === "report" && renderReport()}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100">
        <div className="container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Banyan Financial Education. All rights
          reserved.
        </div>
      </footer>
    </main>
  )
}