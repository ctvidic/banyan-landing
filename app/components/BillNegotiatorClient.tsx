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
// type MsgRole = "agent" | "user"
type MsgRole = "user" | "Sarah" | "Marco";
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
  const [isCallEndedByAgent, setIsCallEndedByAgent] = useState<boolean>(false);
  const [isEscalationAcknowledgementPending, setIsEscalationAcknowledgementPending] = useState<boolean>(false);

  // State flags for improved call end and scoring logic
  const [callEndedAndNeedsScoring, setCallEndedAndNeedsScoring] = useState<boolean>(false);
  const [userRequestedDisconnect, setUserRequestedDisconnect] = useState<boolean>(false);

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

  const score = useCallback(async (transcript: string) => {
    console.log("BN_CLIENT: score() called. Transcript provided:", transcript);
    // const transcript = messages.map(m=>`${m.role.toUpperCase()}: ${m.text}`).join("\n"); // Transcript is now passed as an argument
    // console.log("BN_CLIENT: Transcript for scoring:", transcript);
    try {
      const r = await fetch("/api/openai/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt:`You are a negotiation coach. Based only on this transcript, evaluate the customer\'s negotiation performance. Respond ONLY with a flat JSON object with these keys: strengths (array of strings), improvements (array of strings), outcome (string), rating (string). Do not nest the result under any other key. Outcome should be focused mainly on the reduction the customer got from the bill. Rating should be a star rating out of 5, based on SOLELY on how much the customer was able to get the bill reduced (ex: ⭐⭐⭐⭐⭐ for 5 stars for under $69, ⭐⭐⭐⭐☆ for 4 stars for $69-$79, ⭐⭐⭐☆☆ for 3 stars for $79-$89, etc.). \n\n${transcript}`})});
      
      console.log("BN_CLIENT: Score API response status:", r.status, "OK?:", r.ok);

      if (!r.ok) {
        const errorText = await r.text();
        console.error("BN_CLIENT: Score API request failed.", r.status, errorText);
        setReport({ error: `API request failed with status ${r.status}`, details: errorText });
        return;
      }

      const j = await r.json(); 
      console.log("BN_CLIENT: Score API response JSON:", JSON.stringify(j, null, 2));
      setReport(j);
    } catch (error) {
      console.error("BN_CLIENT: Error in score function (fetching or parsing JSON):", error);
      setReport({ error: "Failed to fetch or parse score data.", details: String(error) });
    }
  // }, [messages, setReport]);
  }, [setReport]); // messages is removed as transcript is now an argument

  // agentLogic: Passed to the hook. Seems stable as it uses roleRef and its direct argument.
  // If it were to use other component state/props, it should be memoized with useCallback.
  async function agentLogic(userText:string){
    console.log("BN_CLIENT: agentLogic called. User text:", userText, ". Current roleRef:", roleRef.current, "isRoleChangeStaged:", isRoleChangeStaged, "currentRoleForEffect:", currentRoleForEffect, "isEscalationPending:", isEscalationAcknowledgementPending);
    if (/supervisor|manager/i.test(userText)) {
      if (roleRef.current === "agent_frontline") {
        // Only stage if not already staged for supervisor and not already pending acknowledgement for this escalation
        if ((!isRoleChangeStaged || currentRoleForEffect !== "agent_supervisor")) {
          console.log("BN_CLIENT: Escalation to supervisor detected. Staging role change from agent_frontline to agent_supervisor.");
          setCurrentRoleForEffect("agent_supervisor"); // Set the TARGET role for the upcoming switch
          setIsRoleChangeStaged(true);                 // Signal that a switch is pending
          setIsEscalationAcknowledgementPending(true); // Signal that we are waiting for the current agent to acknowledge this specific escalation
          // DO NOT change roleRef.current here. Let the frontline agent respond first.
        } else {
          console.log("BN_CLIENT: Escalation to supervisor detected, but change to supervisor is already staged or pending acknowledgement.");
        }
      } else if (roleRef.current === "agent_supervisor") {
        console.log("BN_CLIENT: Escalation detected, but roleRef.current is already agent_supervisor.");
      } else {
        // This case might occur if roles other than frontline/supervisor are introduced
        console.log("BN_CLIENT: Escalation detected, but current role is unexpected:", roleRef.current);
      }
    }
  }
  
  // This function is called by the hook when the agent signals call end.
  const handleAgentInitiatedCallEnd = useCallback(() => {
    window.alert("The agent has ended the call.");
    setIsCallEndedByAgent(true);
    // User will click "Show my score!" to navigate
    // const currentTranscript = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n"); // Score via useEffect
    // console.log("BN_CLIENT: Agent ended call. Transcript for scoring:", currentTranscript);
    // score(currentTranscript); // Score via useEffect
    setCallEndedAndNeedsScoring(true);
    // Disconnection will be handled by an effect watching isCallEndedByAgent
  // }, [setIsCallEndedByAgent, score, messages]);
  }, [setIsCallEndedByAgent]); // score and messages removed, setCallEndedAndNeedsScoring is stable

  // Instantiate the hook
  const {
    connect: realtimeConnect,
    disconnect: realtimeDisconnect,
  } = useRealtimeNegotiation({
    onMessagesUpdate: handleMessagesUpdate,
    onAgentSpeakingChange: handleAgentSpeakingChange,
    onSessionStatusChange: handleSessionStatusChange,
    currentAgentRole: roleRef.current,
    onUserTranscriptCompleted: agentLogic,
    onAgentEndedCall: handleAgentInitiatedCallEnd, // Pass the stable callback
  });

  // Effect to disconnect if agent ended the call and session is not already disconnected
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isCallEndedByAgent && currentSessionStatus !== "DISCONNECTED") {
      console.log("BN_CLIENT: Agent ended call, scheduling disconnection in 500ms via useEffect.");
      timerId = setTimeout(() => {
        console.log("BN_CLIENT: Agent ended call, DISCONNECTING NOW (after delay).");
        realtimeDisconnect();
      }, 500); // 500ms delay
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isCallEndedByAgent, currentSessionStatus, realtimeDisconnect]);

  // User-initiated end call
  const endCallByUser = useCallback(() => {
    console.log("BN_CLIENT: endCallByUser invoked.");
    // if (currentSessionStatus !== "DISCONNECTED") { // Disconnect via useEffect
    //   realtimeDisconnect();
    // }
    setPhase("report");
    // const currentTranscript = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n"); // Score via useEffect
    // console.log("BN_CLIENT: User ended call. Transcript for scoring:", currentTranscript);
    // score(currentTranscript); // Score via useEffect
    setCallEndedAndNeedsScoring(true);
    setUserRequestedDisconnect(true); // Signal for useEffect to disconnect
  // }, [realtimeDisconnect, setPhase, score, currentSessionStatus, messages]);
  }, [setPhase]); // Removed realtimeDisconnect, score, currentSessionStatus, messages. Stable setters omitted.

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
  const [currentRoleForEffect, setCurrentRoleForEffect] = useState<RealtimeAgentRole>(roleRef.current);
  const [isRoleChangeStaged, setIsRoleChangeStaged] = useState<boolean>(false);

  // Effect to clear the pending acknowledgement flag once the agent starts speaking
  useEffect(() => {
    if (isEscalationAcknowledgementPending && isRealtimeAgentSpeaking) {
      console.log("BN_CLIENT: Agent has started speaking, clearing isEscalationAcknowledgementPending.");
      setIsEscalationAcknowledgementPending(false);
    }
  }, [isEscalationAcknowledgementPending, isRealtimeAgentSpeaking]);

  useEffect(() => {
    // Part 2: Execute the Staged Role Change if conditions are met
    if (
      isRoleChangeStaged &&
      !isRealtimeAgentSpeaking &&
      !isEscalationAcknowledgementPending && // Ensure acknowledgement has been processed
      currentSessionStatus === "CONNECTED"
    ) {
      // Current agent (roleRef.current) has finished speaking. Switch to currentRoleForEffect is imminent.
      // Client-side injected text message REMOVED. Sarah is expected to say this via server-side prompt.
      // if (roleRef.current === "agent_frontline" && currentRoleForEffect === "agent_supervisor") {
      //   const ackMsg: Message = {
      //     id: "ack-" + Date.now(),
      //     role: "Sarah", // This will be displayed as "Sarah:" in the transcript
      //     text: "Okay, I'll transfer you to my supervisor now. One moment, please."
      //   };
      //   setMsgs(prevMsgs => [...prevMsgs, ackMsg]);
      //   console.log("BN_CLIENT: Injected transfer acknowledgement message from Sarah into transcript.");
      // }
      // TODO: Add similar logic if other transfer types are implemented, e.g., supervisor back to frontline.

      console.log(
        "BN_CLIENT: Role change staged, agent NOT speaking, ack processed, and connected. EXECUTING reconnect to role:",
        currentRoleForEffect // This is the target role, e.g., "agent_supervisor"
      );

      if (roleRef.current !== currentRoleForEffect) {
        console.log("BN_CLIENT: Disconnecting for role change. Old role:", roleRef.current, "New role:", currentRoleForEffect);
        realtimeDisconnect(); // Disconnect current session

        console.log("BN_CLIENT: Updating roleRef.current from", roleRef.current, "to", currentRoleForEffect, "before reconnect.");
        roleRef.current = currentRoleForEffect; // Update roleRef to the new target role

        console.log("BN_CLIENT: Role change useEffect: Calling realtimeConnect in 100ms with new role:", roleRef.current);
        setTimeout(() => realtimeConnect(), 100); // realtimeConnect will use the updated roleRef.current
      } else {
        console.log("BN_CLIENT: Role change staged, but roleRef.current already matches targetRole. No reconnect needed. Target role:", currentRoleForEffect);
      }
      setIsRoleChangeStaged(false); // Reset the staged flag
    } else if (isRoleChangeStaged && isRealtimeAgentSpeaking && currentSessionStatus === "CONNECTED") {
      // If acknowledgement is pending, this log is now less relevant as the new useEffect handles the pending state logic first.
      // However, this overall condition (staged, speaking, connected) is still valid for general waiting.
      if (isEscalationAcknowledgementPending) {
        console.log("BN_CLIENT: Role change staged, agent IS SPEAKING. Waiting for acknowledgement to complete (isEscalationAcknowledgementPending will be cleared).");
      } else {
        console.log("BN_CLIENT: Role change staged, agent IS SPEAKING (acknowledged). Waiting for agent to finish current speech before switching.");
      }
    } else if (isRoleChangeStaged && currentSessionStatus !== "CONNECTED") {
      console.log("BN_CLIENT: Role change staged, but session is NOT CONNECTED (" + currentSessionStatus + "). Clearing staged change and pending ack.");
      setIsRoleChangeStaged(false); // Reset if we get disconnected while a change is staged
      setIsEscalationAcknowledgementPending(false); // Also clear pending acknowledgement
    } else if (isRoleChangeStaged && isEscalationAcknowledgementPending && !isRealtimeAgentSpeaking) {
      console.log("BN_CLIENT: Role change staged, acknowledgement pending, but agent is NOT speaking. Waiting for agent to start acknowledgement.");
    } else if (!isRoleChangeStaged) {
      // This block is for when no role change is staged. Log existing conditions if needed.
      // console.log("BN_CLIENT: No role change staged. Current role for effect:", currentRoleForEffect, "Session:", currentSessionStatus);
    }
  }, [
    currentSessionStatus,
    realtimeConnect,
    realtimeDisconnect,
    currentRoleForEffect,    // Holds the target role for the staged change
    isRealtimeAgentSpeaking,
    isRoleChangeStaged,
    isEscalationAcknowledgementPending,
    // setCurrentRoleForEffect and setIsRoleChangeStaged are setters, not needed in deps
  ]);

  // Effect to handle scoring after call ends
  useEffect(() => {
    if (callEndedAndNeedsScoring) {
      const finalTranscript = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
      console.log("BN_CLIENT: Scoring via useEffect. Transcript for scoring:", finalTranscript);
      score(finalTranscript);
      setCallEndedAndNeedsScoring(false); // Reset the flag
    }
  }, [callEndedAndNeedsScoring, messages, score]);

  // Effect for user-initiated disconnect
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (userRequestedDisconnect) {
      if (currentSessionStatus !== "DISCONNECTED") {
        console.log("BN_CLIENT: User request: scheduling disconnection in 500ms.");
        timerId = setTimeout(() => {
          console.log("BN_CLIENT: User request: DISCONNECTING NOW (after delay).");
          realtimeDisconnect();
        }, 500);
      }
      // Reset the flag once the disconnect process is initiated (or if already disconnected)
      setUserRequestedDisconnect(false);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [userRequestedDisconnect, currentSessionStatus, realtimeDisconnect, setUserRequestedDisconnect]);

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
              // <p key={m.id} className={`text-sm mb-2 ${m.role==="agent"?"text-gray-800":"text-blue-600"}`}>
              //   <strong>{m.role==="agent"?"Agent":"You"}:</strong> {m.text}
              <p key={m.id} className={`text-sm mb-2 ${m.role !== "user" ? "text-gray-800" : "text-blue-600"}`}>
                <strong>{m.role === "user" ? "You" : m.role}:</strong> {m.text}
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
        <Button variant="outline" onClick={()=>setActiveDrawerTab("transcript")}> Transcript </Button>
        <Button variant="outline" onClick={()=>setActiveDrawerTab("mission")}> Mission </Button>
        <Button variant="outline" onClick={()=>setActiveDrawerTab("tips")}> Tips </Button>
        <Button
          // variant="ghost" // Removing ghost variant to apply custom background
          className={`px-4 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${isCallEndedByAgent ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          onClick={isCallEndedByAgent ? () => setPhase("report") : endCallByUser} 
        >
          {isCallEndedByAgent ? "Show my report!" : "End Call"}
        </Button>
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
          ("strengths" in first || "improvements" in first || "outcome" in first || "rating" in first)
        ) {
          return first;
        }
      }
      // If already in the right shape, return as is
      if (
        report &&
        typeof report === "object" &&
        ("strengths" in report || "improvements" in report || "outcome" in report || "rating" in report)
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
            {parsed.rating && (
              <div>
                <h2 className="font-semibold mb-1">Rating</h2>
                <p>{parsed.rating}</p>
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