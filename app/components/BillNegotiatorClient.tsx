"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  ArrowLeft,
  Mic,
  List,
  PhoneOff
} from "lucide-react"
import { 
  useRealtimeNegotiation, 
  SessionStatus as RealtimeSessionStatus,
  AgentRole as RealtimeAgentRole 
} from "../hooks/useRealtimeNegotiation"

/*-------------------------------------------------------------------------*/
/*  Message + Scenario types                                               */
/*-------------------------------------------------------------------------*/
type MsgRole = "agent" | "user"
type Message = { id: string; role: MsgRole; text: string }

// SCENARIO, stepId, detectIntent are being removed for MVP with Realtime API
// const SCENARIO: ScenarioStep[] = [
//   { id: "greeting",      expect: "name",   next: "explain_issue" },
//   { id: "explain_issue", expect: "issue",  next: "explain_bill"  },
//   {
//     id: "explain_bill",
//     expect: ["loyalty", "misled", "escalate"],
//     next: (intent: string) => {
//       if (intent === "escalate")            return "supervisor"
//       if (intent === "loyalty" || intent==="misled") return "resolution"
//       return "explain_bill"
//     }
//   },
//   { id: "supervisor",  expect: "final", next: "resolution" },
//   { id: "resolution",  expect: "end",   next: null }
// ]

/*-------------------------------------------------------------------------*/
/*                 Component                                               */
/*-------------------------------------------------------------------------*/
export default function BillNegotiatorClient() {
  // flow pages
  const [phase, setPhase] = useState<"intro"|"scenario"|"call"|"report">("intro")

  // call state
  const [messages,  setMsgs]      = useState<Message[]>([])
  // const [stepId,    setStepId]    = useState("greeting") // Removed for MVP
  const [activeDrawerTab, setActiveDrawerTab] = useState<null|"transcript"|"mission"|"tips">(null)
  const [report,    setReport]    = useState<any>(null)
  const roleRef = useRef<RealtimeAgentRole>("agent_frontline")

  // New state for Realtime API
  const [currentSessionStatus, setCurrentSessionStatus] = useState<RealtimeSessionStatus>("DISCONNECTED");
  const [isRealtimeAgentSpeaking, setIsRealtimeAgentSpeaking] = useState<boolean>(false);

  // Callbacks for the hook
  const handleMessagesUpdate = useCallback((newMessages: Message[]) => {
    setMsgs(newMessages);
  }, [setMsgs]);

  const handleAgentSpeakingChange = useCallback((isSpeaking: boolean) => {
    setIsRealtimeAgentSpeaking(isSpeaking);
  }, [setIsRealtimeAgentSpeaking]);

  const handleSessionStatusChange = useCallback((status: RealtimeSessionStatus) => {
    setCurrentSessionStatus(status);
  }, [setCurrentSessionStatus]);

  // Instantiate the hook
  const {
    connect: realtimeConnect,
    disconnect: realtimeDisconnect,
  } = useRealtimeNegotiation({
    onMessagesUpdate: handleMessagesUpdate,
    onAgentSpeakingChange: handleAgentSpeakingChange,
    onSessionStatusChange: handleSessionStatusChange,
    currentAgentRole: roleRef.current,
  });


  /* --- Start connection when phase switches to "call" --- */
  useEffect(() => {
    if (phase === "call" && currentSessionStatus === "DISCONNECTED") {
      console.log("Phase is call, attempting to connect to Realtime API...");
      realtimeConnect();
    }
    // Cleanup on phase change or unmount if connected
    return () => {
      if (phase !== "call" && (currentSessionStatus === "CONNECTED" || currentSessionStatus === "CONNECTING")) {
        console.log("Phase changed from call or component unmounting, disconnecting Realtime API...");
        realtimeDisconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, realtimeConnect, realtimeDisconnect]); 
  
  // Effect to handle agent role change (e.g. escalation to supervisor)
  // This effect needs careful management of how roleRef.current changes are propagated if not tied to a state re-render.
  // For now, assuming roleRef.current is updated correctly before this effect is (re)triggered indirectly.
  const [currentRoleForEffect, setCurrentRoleForEffect] = useState<RealtimeAgentRole>(roleRef.current); // Helper state to trigger effect for roleRef changes
  
  useEffect(() => {
    if (roleRef.current !== currentRoleForEffect) {
      // Update helper state only if there's an actual change to avoid loops if roleRef is set multiple times to same value.
      setCurrentRoleForEffect(roleRef.current);
    }
    
    if (currentSessionStatus === "CONNECTED" && roleRef.current !== currentRoleForEffect && currentRoleForEffect !== undefined /* ensure initial undefined state doesn't trigger */ ) {
      console.log("Agent role changed to:", roleRef.current, "Reconnecting for new role.");
      realtimeDisconnect();
      setTimeout(() => realtimeConnect(), 100); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleRef.current, currentSessionStatus, realtimeConnect, realtimeDisconnect]); // currentRoleForEffect removed from deps to avoid potential loops directly based on it.
  // The intent is to react to roleRef.current changing, which the currentRoleForEffect state helps facilitate by causing a re-render.


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
      className="fixed right-0 top-0 h-full w-72 max-w-full bg-white shadow-lg pb-4 px-4 overflow-y-auto z-50 flex flex-col md:absolute md:top-16 md:h-[calc(100%-4rem)] md:w-72"
      style={{maxWidth: '18rem'}}
    >
      <div className="sticky top-0 z-10 bg-white pb-2 mb-4 -mx-4 px-4 min-h-[3.5rem] border-b border-gray-100 pt-5 md:pt-0">
        <div className="flex items-center justify-between">
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
        {/* Section header for each tab */}
        <div>
          {activeDrawerTab==="transcript"}
          {activeDrawerTab==="mission"}
          {activeDrawerTab==="tips"}
        </div>
      </div>
      <div className="flex-1 pt-4">
        {activeDrawerTab==="transcript" && (
          <div>
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

        {/* mic button - For MVP, this might be a status indicator or disabled if using server VAD primarily */}
        <button
          // onClick={...} // Functionality to be determined for MVP (PTT or status)
          disabled // Disable for now until PTT logic is decided
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full h-16 w-16 flex items-center
                      justify-center ${isRealtimeAgentSpeaking ?"bg-gray-500":"bg-gray-400"}`}> 
                      {/* Visuals depend on desired MVP state, e.g., isRealtimeAgentSpeaking or currentSessionStatus */} 
          {currentSessionStatus === "CONNECTED" ? <Mic className="h-8 w-8 text-white"/> : <PhoneOff className="h-8 w-8 text-white"/>}
        </button>
      </div>

      {/* controls */}
      <div className="mt-4 flex items-center gap-4">
        <Button variant="outline" onClick={()=>setActiveDrawerTab("transcript")}> <List className="h-4 w-4 mr-2"/> Transcript </Button>
        <Button variant="outline" onClick={()=>setActiveDrawerTab("mission")}> Mission </Button>
        <Button variant="outline" onClick={()=>setActiveDrawerTab("tips")}> Tips </Button>
        <Button variant="ghost" onClick={endCall}>End Call</Button> {/* endCall needs to be updated */}
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

    // Normalization function to ensure flat structure
    function normalizeReport(report: any) {
      // If wrapped in a single key, unwrap it
      if (
        report &&
        typeof report === "object" &&
        !Array.isArray(report) &&
        Object.keys(report).length === 1
      ) {
        const first = Object.values(report)[0];
        if (
          first &&
          typeof first === "object" &&
          ("strengths" in first || "improvements" in first || "outcome" in first)
        ) {
          return first;
        }
      }
      // If already in the right shape, return as is
      if (
        report &&
        typeof report === "object" &&
        ("strengths" in report || "improvements" in report || "outcome" in report)
      ) {
        return report;
      }
      // Otherwise, return null or a default
      return null;
    }

    const parsedRaw = parseReport(report);
    // let parsed = parsedRaw;
    // if (parsed && parsed.customer) parsed = parsed.customer;
    const parsed = normalizeReport(parsedRaw);

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

  async function agentLogic(userText:string){ // This function will change significantly
    // The primary role of this function in MVP might be to detect supervisor requests
    // and update roleRef.current, which then triggers the useEffect to reconnect.
    // Direct chat logic via fetch is removed.

    console.log("agentLogic called with user text (for potential escalation):", userText);
    if (/supervisor|manager/i.test(userText)){
      if (roleRef.current !== "agent_supervisor") { // Prevent re-triggering if already supervisor
        console.log("Escalation to supervisor detected.");
        roleRef.current="agent_supervisor";
        // The useEffect watching roleRef.current will handle the reconnect.
        // Need to ensure this change to roleRef.current is picked up by the effect.
        // This might require a state update that causes a re-render.
        // For now, we rely on the existing (potentially flawed) useEffect for roleRef.current
        // Or, if this function is called as a result of a user message completion from the hook,
        // that might trigger a re-render anyway.
      }
    }

    // For MVP, the Realtime API agent handles responses based on its instructions.
    // We don't make a separate chat API call here.
    // The userText is sent to Realtime API by the hook's internal mechanisms.
    // If we need to send a text message explicitly from here (e.g. after user types in a box)
    // we would call a function exposed by useRealtimeNegotiation like `sendUserTextMessage(userText)`.
  }

  async function score(){ // Unchanged, but called by endCall
    const transcript = messages.map(m=>`${m.role.toUpperCase()}: ${m.text}`).join("\n")
    const r = await fetch("/api/openai/chat",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt:`You are a negotiation coach. Based only on this transcript, evaluate the customer's negotiation performance. Respond ONLY with a flat JSON object with these keys: strengths (array of strings), improvements (array of strings), outcome (string). Do not nest the result under any other key.\n\n${transcript}`})})
    const j = await r.json(); setReport(j)
  }
  
  function endCall(){ 
    console.log("End Call requested.");
    realtimeDisconnect(); 
    setPhase("report"); 
    score(); 
  }

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