"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  ArrowLeft,
  Mic,
  List,
  PhoneOff
} from "lucide-react"

/*-------------------------------------------------------------------------*/
/*  Message + Scenario types                                               */
/*-------------------------------------------------------------------------*/
type MsgRole = "agent" | "user"
type Message = { id: string; role: MsgRole; text: string }

type ScenarioStep = {
  id: string
  expect: string | string[]
  next: ((intent: string) => string) | string | null
}

const SCENARIO: ScenarioStep[] = [
  { id: "greeting",      expect: "name",   next: "explain_issue" },
  { id: "explain_issue", expect: "issue",  next: "explain_bill"  },
  {
    id: "explain_bill",
    expect: ["loyalty", "misled", "escalate"],
    next: (intent: string) => {
      if (intent === "escalate")            return "supervisor"
      if (intent === "loyalty" || intent==="misled") return "resolution"
      return "explain_bill"
    }
  },
  { id: "supervisor",  expect: "final", next: "resolution" },
  { id: "resolution",  expect: "end",   next: null }
]

/*-------------------------------------------------------------------------*/
/*                 Component                                               */
/*-------------------------------------------------------------------------*/
export default function BillNegotiatorClient() {
  // flow pages
  const [phase, setPhase] = useState<"intro"|"scenario"|"call"|"report">("intro")

  // call state
  const [messages,  setMsgs]      = useState<Message[]>([])
  const [stepId,    setStepId]    = useState("greeting")
  const [recording, setRec]       = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState<null|"transcript"|"mission"|"tips">(null)
  const [report,    setReport]    = useState<any>(null)
  const roleRef                  = useRef<"agent_frontline"|"agent_supervisor">("agent_frontline")

  // media + VAD refs
  const mediaRec  = useRef<MediaRecorder|null>(null)
  const audioCtx  = useRef<AudioContext|null>(null)

  /* --- Start first agent line when phase switches to "call" --- */
  useEffect(() => {
    if (phase==="call" && messages.length===0) {
      sayAsAgent("Hello, thank you for calling customer service. May I have your name, please?")
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  /*-------------------------------------------------------------------------*/
  /* UI SECTIONS                                                             */
  /*-------------------------------------------------------------------------*/
  const renderIntro = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Bill Negotiator Simulator</h1>
      <p className="text-lg text-gray-600 mb-6">
        Practice your negotiation skills in this interactive simulation. You'll be given
        a scenario and will negotiate with a customer-service representative to resolve your issue.
      </p>
      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
              onClick={()=>setPhase("scenario")}>
        Get Started
      </Button>
    </div>
  )

  const renderScenario = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Unexpected Internet Bill Increase</h1>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Scenario</h2>
        <p className="text-gray-700 mb-4">
          You notice your internet bill has increased from $69 to $89 per month without any prior
          notification. You're calling customer service to get this resolved.
        </p>
        <h3 className="text-lg font-semibold mb-2">Your Goal</h3>
        <p className="text-gray-700">
          Try to get your bill reduced back to the original price or negotiate for additional
          services to justify the price increase.
        </p>
      </div>
      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
              onClick={()=>setPhase("call")}>
        Start Call
      </Button>
    </div>
  )

  // Drawer content for Mission
  const renderMission = () => (
    <div>
      <h3 className="font-semibold mb-2">Your Scenario</h3>
      <p className="text-gray-700 mb-4">
        You notice your internet bill has increased from $69 to $89 per month without any prior notification. You're calling customer service to get this resolved.
      </p>
      <h4 className="font-semibold mb-1">Your Goal</h4>
      <p className="text-gray-700">
        Try to get your bill reduced back to the original price or negotiate for additional services to justify the price increase.
      </p>
    </div>
  )

  // Drawer content for Tips
  const renderTips = () => (
    <div>
      <h3 className="font-semibold mb-2">Negotiation Tips</h3>
      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
        <li>Stay calm and polite, even if frustrated.</li>
        <li>Clearly state your issue and desired outcome.</li>
        <li>Ask clarifying questions if you don't understand something.</li>
        <li>Mention your loyalty or history as a customer if relevant.</li>
        <li>Be persistent but respectful if you need to escalate.</li>
      </ul>
    </div>
  )

  // Multi-tab Drawer
  const renderDrawer = () => (
    <aside
      className="fixed right-0 top-0 h-full w-72 max-w-full bg-white shadow-lg p-4 overflow-y-auto z-50 flex flex-col md:absolute md:top-16 md:h-[calc(100%-4rem)] md:w-72"
      style={{maxWidth: '18rem'}}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${activeDrawerTab==="transcript" ? "bg-emerald-100 text-emerald-700" : "text-gray-500"}`}
            onClick={()=>setActiveDrawerTab("transcript")}
          >Transcript</button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${activeDrawerTab==="mission" ? "bg-emerald-100 text-emerald-700" : "text-gray-500"}`}
            onClick={()=>setActiveDrawerTab("mission")}
          >Mission</button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${activeDrawerTab==="tips" ? "bg-emerald-100 text-emerald-700" : "text-gray-500"}`}
            onClick={()=>setActiveDrawerTab("tips")}
          >Tips</button>
        </div>
        <button
          className="ml-auto text-gray-400 hover:text-gray-700 text-xl font-bold"
          aria-label="Close drawer"
          onClick={()=>setActiveDrawerTab(null)}
        >&times;</button>
      </div>
      <div className="flex-1">
        {activeDrawerTab==="transcript" && (
          <div>
            <h3 className="font-semibold mb-4">Transcript</h3>
            {messages.map(m=>(
              <p key={m.id} className={`text-sm mb-2 ${m.role==="agent"?"text-gray-800":"text-blue-600"}`}>
                <strong>{m.role==="agent"?"Agent":"You"}:</strong> {m.text}
              </p>
            ))}
          </div>
        )}
        {activeDrawerTab==="mission" && renderMission()}
        {activeDrawerTab==="tips" && renderTips()}
      </div>
    </aside>
  )

  const renderCall = () => (
    <div className="flex flex-col items-center">
      {/* iPhone-ish frame */}
      <div className="relative w-72 h-96 bg-black rounded-[2.5rem] shadow-inner flex flex-col items-center pt-16">
        <p className="text-white/60 text-xs">
          {roleRef.current==="agent_supervisor" ? "Supervisor" : "Customer Service"}
        </p>
        <h2 className="text-white mt-1">
          {roleRef.current==="agent_supervisor" ? "Marco (Supervisor)" : "Sarah (Customer Service Rep)"}
        </h2>

        {/* mic button */}
        <button
          onClick={recording?manualStop:startRecording}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full h-16 w-16 flex items-center
                      justify-center ${recording?"bg-red-600":"bg-emerald-600"}`}>
          {recording ? <PhoneOff className="h-8 w-8 text-white"/> : <Mic className="h-8 w-8 text-white"/>}
        </button>
      </div>

      {/* controls */}
      <div className="mt-4 flex items-center gap-4">
        <Button variant="outline" onClick={()=>setActiveDrawerTab("transcript")}> <List className="h-4 w-4 mr-2"/> Transcript </Button>
        <Button variant="outline" onClick={()=>setActiveDrawerTab("mission")}> Mission </Button>
        <Button variant="outline" onClick={()=>setActiveDrawerTab("tips")}> Tips </Button>
        <Button variant="ghost" onClick={endCall}>End Call</Button>
      </div>

      {/* optional drawer */}
      {activeDrawerTab && renderDrawer()}
    </div>
  )

  const renderReport = () => {
    // Helper to clean and parse the report
    function parseReport(report: any) {
      if (!report) return null;
      let text = typeof report === "string" ? report : report.text || "";
      // Remove code block markers and trim
      text = text.replace(/```json|```/g, "").trim();
      try {
        return JSON.parse(text);
      } catch {
        // If already an object or parsing fails, return as is
        return typeof report === "object" ? report : null;
      }
    }

    const parsed = parseReport(report);

    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Negotiation Report</h1>
        {parsed ? (
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4 overflow-y-auto" style={{maxHeight: 400}}>
            {parsed.strengths && (
              <div>
                <h2 className="font-semibold mb-1">Strengths</h2>
                <ul className="list-disc pl-5">
                  {parsed.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {parsed.improvements && (
              <div>
                <h2 className="font-semibold mb-1">Improvements</h2>
                <ul className="list-disc pl-5">
                  {parsed.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            {parsed.outcome && (
              <div>
                <h2 className="font-semibold mb-1">Outcome</h2>
                <p>{parsed.outcome}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Loading…</p>
        )}
        <Button variant="outline" className="mt-6" onClick={()=>location.reload()}>Try Again</Button>
      </div>
    );
  }

  /*-------------------------------------------------------------------------*/
  /*  Recording with 1-second silence VAD                                    */
  /*-------------------------------------------------------------------------*/
  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true })
    const mr = new MediaRecorder(stream,{ mimeType:"audio/webm;codecs=opus" })
    mediaRec.current = mr
    setRec(true)

    // RMS silence detector
    audioCtx.current = new AudioContext()
    const src = audioCtx.current.createMediaStreamSource(stream)
    const ana = audioCtx.current.createAnalyser()
    ana.fftSize = 2048
    src.connect(ana)
    const data = new Uint8Array(ana.fftSize)

    let silenceStart: number|null = null
    const SILENCE_MS = 1000
    const THRESHOLD = 0.015            // ≈ -43 dBFS   [oai_citation:0‡Pavitra's Metaverse](https://pavi2410.me/blog/detect-silence-using-web-audio/?utm_source=chatgpt.com)

    function detect() {
      ana.getByteTimeDomainData(data)
      const rms = Math.sqrt(data.reduce((s,v)=>{ const x=(v-128)/128; return s+x*x },0)/data.length)
      if (rms < THRESHOLD) {                              // quiet
        if (!silenceStart) silenceStart = performance.now()
        if (performance.now() - silenceStart > SILENCE_MS) mr.stop()
      } else {
        silenceStart = null
      }
      if (mr.state==="recording") requestAnimationFrame(detect)
    }
    detect()

    const chunks: BlobPart[] = []
    mr.ondataavailable = e=>chunks.push(e.data)
    mr.onstop = async () => {
      setRec(false)
      audioCtx.current?.close()
      const blob = new Blob(chunks,{ type:"audio/webm" })
      const text = await transcribe(blob)
      pushUser(text)
      await agentLogic(text)
    }
    mr.start()
  }
  function manualStop(){ mediaRec.current?.stop(); }  // fallback

  /*-------------------------------------------------------------------------*/
  /*  Transcribe                                                             */
  /*-------------------------------------------------------------------------*/
  async function transcribe(blob:Blob){
    const fd = new FormData()
    fd.append("file", blob, "audio.webm")
    fd.append("model","gpt-4o-mini-transcribe")
    const r = await fetch("/api/openai/transcribe",{method:"POST",body:fd})
    const j = await r.json()
    return j.text as string
  }

  /*-------------------------------------------------------------------------*/
  /*  Messaging helpers                                                      */
  /*-------------------------------------------------------------------------*/
  function pushUser(text:string){ setMsgs(m=>[...m,{id:crypto.randomUUID(),role:"user",text}]) }
  async function sayAsAgent(text:string){
    setMsgs(m=>[...m,{id:crypto.randomUUID(),role:"agent",text}])
    await speak(text)
  }

  /*-------------------------------------------------------------------------*/
  /*  Scenario + GPT steering                                                */
  /*-------------------------------------------------------------------------*/
  function detectIntent(u:string){
    const lc = u.toLowerCase()
    if (/supervisor|manager/.test(lc)) return "escalate"
    if (/loyal|been with you/.test(lc))return "loyalty"
    if (/did(?:n't| not) know/.test(lc))return "misled"
    if (stepId==="greeting")           return "name"
    if (stepId==="explain_issue")      return "issue"
    if (stepId==="supervisor")         return "final"
    return "unknown"
  }

  async function agentLogic(userText:string){
    // escalate?
    if (/supervisor|manager/i.test(userText)){
      roleRef.current="agent_supervisor"
    }

    const intent   = detectIntent(userText)
    const step     = SCENARIO.find(s=>s.id===stepId)!
    const nextId   = typeof step.next==="function" ? step.next(intent) : step.next
    if (nextId) setStepId(nextId)

    // build GPT prompt
    const recent   = messages.slice(-5).map(m=>({ role:m.role==="agent"?"assistant":"user", content:m.text }))
    recent.push({ role:"user", content:userText })

    const sysPrompt =
      roleRef.current==="agent_frontline"
        ? "You are Sarah, an Indian call-centre rep (friendly but tired, fake enthusiasm). " +
          "Your job is to resolve a billing issue: the customer's internet bill jumped from $69 to $89 " +
          "after a 12-month promo expired. Ask their name, get their issue, then explain the promo. " +
          "The ONLY ways forward are: get them to admit that it was a promo price, acknowledge loyalty and offer slightly (but not fully) reduced price, or escalate to supervisor IF THEY INSIST. " +
          "Keep things courteous, concise and guide toward resolution."
        : "You are Marco, a Filipino supervisor—authoritative yet polite. " +
          "You join after escalation. Help the customer reach one of: full discount, partial discount, " +
          "added features, or downgrading plan to a cheaper one (lower speed). Close the call once resolved."

    const chatBody = { sysPrompt, messages: recent }

    const r   = await fetch("/api/openai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(chatBody)})
    const {text} = await r.json()
    await sayAsAgent(text)

    // finish if at resolution
    if (!nextId){
      await score()
      setPhase("report")
    }
  }

  /*-------------------------------------------------------------------------*/
  /*  TTS                                                                    */
  /*-------------------------------------------------------------------------*/
  async function speak(text:string){
    const voice = roleRef.current==="agent_frontline" ? "coral" : "sage"   // OpenAI official voices list  [oai_citation:1‡OpenAI Platform](https://platform.openai.com/docs/guides/text-to-speech?utm_source=chatgpt.com)
    
    // Add custom instructions based on the character using structured format
    const instructions = roleRef.current==="agent_frontline" 
      ? "Voice: stereotypical Indian accent\n\nTone: friendly but not particularly enthusiastic, tired customer service agent\n\nDialect: Indian English\n\nPronunciation: Very rehearsed, trained in customer service\n\nFeatures: Uses customer service speech patterns and phrases"
      : "Voice: stereotypical Filipino accent\n\nTone: authoritative yet polite, supervisor tone\n\nDialect: Filipino English\n\nPronunciation: Clear and professional with slight accent\n\nFeatures: Speaks with more confidence and authority than frontline agent"
    
    const r = await fetch("/api/openai/tts",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"gpt-4o-mini-tts",
        voice,
        input:text,
        instructions,
        response_format:"opus"
      })})
    const buf = await r.arrayBuffer()
    await new Audio(URL.createObjectURL(new Blob([buf],{type:"audio/mpeg"}))).play()
  }

  /*-------------------------------------------------------------------------*/
  /*  Score at end                                                           */
  /*-------------------------------------------------------------------------*/
  async function score(){
    const transcript = messages.map(m=>`${m.role.toUpperCase()}: ${m.text}`).join("\n")
    const r = await fetch("/api/openai/chat",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt:`You are a negotiation coach. Based only on this transcript, list strengths[], improvements[], outcome as JSON.\n\n${transcript}`})})
    const j = await r.json(); setReport(j)
  }
  function endCall(){ mediaRec.current?.stop(); setPhase("report"); score() }

  /*-------------------------------------------------------------------------*/
  /*  Render wrapper                                                         */
  /*-------------------------------------------------------------------------*/
  return (
    <main className="flex min-h-screen flex-col">
      {/* header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-gray-100/20">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-600"/>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
              Banyan
            </span>
          </Link>
          <div className="ml-auto"/>
        </div>
      </header>

      {/* body */}
      <section className="py-16 flex-grow">
        <div className="container">
          {phase==="intro"    && renderIntro()}
          {phase==="scenario" && renderScenario()}
          {phase==="call"     && renderCall()}
          {phase==="report"   && renderReport()}
        </div>
      </section>

      {/* footer */}
      <footer className="py-6 border-t border-gray-100">
        <div className="container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Banyan Financial Education. All rights reserved.
        </div>
      </footer>
    </main>
  )
}