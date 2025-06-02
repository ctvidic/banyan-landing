"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  ArrowLeft,
  Mic,
  List,
  PhoneOff,
  AlertTriangle,
  ChevronDown
} from "lucide-react"
import { 
  useRealtimeNegotiation, 
  SessionStatus as RealtimeSessionStatus,
  // AgentRole as RealtimeAgentRole // Removed unused import
} from "../../hooks/useRealtimeNegotiation"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import type { AgentConfig } from "../../banyanAgentConfigs/types"; // Import AgentConfig type
import { frontlineAgentConfig, supervisorAgentConfig } from "../../banyanAgentConfigs"; // Import agent configs
import { TalkingOrb } from "@/app/components/TalkingOrb" // Import the TalkingOrb component
import confetti from "canvas-confetti" // Import confetti library
import BillNegotiatorLeaderboard from "@/app/bill-negotiator/components/BillNegotiatorLeaderboard"
import { WaitlistForm } from "@/app/components/WaitlistForm"
import { Input } from "@/components/ui/input"

/*-------------------------------------------------------------------------*/
/*  Message + Scenario types                                               */
/*-------------------------------------------------------------------------*/
// type MsgRole = "agent" | "user"
type MsgRole = string;
type Message = { id: string; role: string; text: string }

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
  const [phase, setPhase] = useState<"intro"|"scenario"|"call"|"report">("scenario")
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true)
  const [showTermsDialog, setShowTermsDialog] = useState(false)

  // Add session tracking
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [savedScoreData, setSavedScoreData] = useState<{
    scoreId: string
    userId: string
    rank: number | null
    percentile: number | null
    totalParticipants: number
  } | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showLeaderboardSection, setShowLeaderboardSection] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false)

  // TEST MODE: Set to true to skip to report with mock data
  const TEST_MODE = false; // Change to true for testing
  const MOCK_REPORT = {
    strengths: [
      "Remained calm and professional throughout",
      "Clearly stated the issue with the unexpected bill increase",
      "Successfully negotiated a reduction back to original price"
    ],
    improvements: [
      "Could have asked about additional services or perks",
      "Might have pushed for a longer-term price guarantee"
    ],
    outcome: "Successfully reduced bill from $89 back to $69 per month",
    rating: "⭐⭐⭐⭐☆"
  };

  // call state
  const [messages,  setMsgs]      = useState<Message[]>([])
  // const [stepId,    setStepId]    = useState("greeting") // Removed for MVP
  const [activeDrawerTab, setActiveDrawerTab] = useState<null|"transcript"|"mission"|"tips">(null)
  const [report,    setReport]    = useState<any>(TEST_MODE ? MOCK_REPORT : null)
  // const roleRef = useRef<RealtimeAgentRole>("agent_frontline") // To be replaced by agent config state
  const { toast } = useToast()

  // New state for Realtime API
  const [currentSessionStatus, setCurrentSessionStatus] = useState<RealtimeSessionStatus>("DISCONNECTED");
  const [isRealtimeAgentSpeaking, setIsRealtimeAgentSpeaking] = useState<boolean>(false);
  const [isCallEndedByAgent, setIsCallEndedByAgent] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false); // Track when user is speaking
  // const [isEscalationAcknowledgementPending, setIsEscalationAcknowledgementPending] = useState<boolean>(false); // Will be handled by agent tool calls

  // State for current agent config
  const [currentAgentConfig, setCurrentAgentConfig] = useState<AgentConfig>(frontlineAgentConfig);

  // State flags for improved call end and scoring logic
  const [callEndedAndNeedsScoring, setCallEndedAndNeedsScoring] = useState<boolean>(false);
  const [userRequestedDisconnect, setUserRequestedDisconnect] = useState<boolean>(false);
  const [isTransferInProgress, setIsTransferInProgress] = useState<boolean>(false); // Add state to track transfers

  // TEST MODE: Automatically set up test state
  useEffect(() => {
    if (TEST_MODE) {
      setPhase("call");
      setIsCallEndedByAgent(true);
      setMsgs([
        { id: "1", role: "Sarah", text: "Thank you for calling customer service. My name is Sarah. How can I help you today?" },
        { id: "2", role: "user", text: "Hi Sarah, I noticed my internet bill went up from $69 to $89 without any notice." },
        { id: "3", role: "Sarah", text: "I understand your concern. Let me look into that for you." },
        { id: "4", role: "user", text: "I've been a loyal customer for 5 years and this increase seems unfair." },
        { id: "5", role: "Sarah", text: "You're absolutely right. As a valued customer, I can offer you a promotional rate of $69 for the next 12 months." },
        { id: "6", role: "user", text: "That sounds great, thank you!" },
        { id: "7", role: "Sarah", text: "You're welcome! I've applied the discount to your account. Is there anything else I can help you with?" },
        { id: "8", role: "user", text: "No, that's all. Thank you for your help!" },
        { id: "9", role: "Sarah", text: "Thank you for calling. Have a great day!" }
      ]);
    }
  }, [TEST_MODE]);

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

  const handleUserSpeakingChange = useCallback((isSpeaking: boolean) => {
    setIsUserSpeaking(isSpeaking);
  }, [setIsUserSpeaking]);

  // Add function to save score to backend
  const saveScoreToBackend = useCallback(async (scoreReport: any, email?: string) => {
    if (!sessionStartTime) return;
    
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000); // in seconds
    
    try {
      const response = await fetch('/api/bill-negotiator/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report: scoreReport,
          sessionDuration,
          email: email || userEmail // Include email if provided
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedScoreData(data);
        console.log('Score saved successfully:', data);
        return data;
      } else {
        console.error('Failed to save score:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error saving score:', error);
      return null;
    }
  }, [sessionStartTime, userEmail]);

  const score = useCallback(async (transcript: string) => {
    console.log("BN_CLIENT: score() called. Transcript provided:", transcript);
    // const transcript = messages.map(m=>`${m.role.toUpperCase()}: ${m.text}`).join("\n"); // Transcript is now passed as an argument
    // console.log("BN_CLIENT: Transcript for scoring:", transcript);
    try {
      const r = await fetch("/api/openai/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt:`You are a negotiation coach. Based only on this transcript, evaluate the customer's negotiation performance. Respond ONLY with a flat JSON object with these keys: strengths (array of strings), improvements (array of strings), outcome (string), rating (string), confettiWorthy (boolean). Do not nest the result under any other key. 

CRITICAL SCORING RULES:
- If the customer says nothing or only greets without negotiating: ☆☆☆☆☆ (0 stars - display as empty stars)
- If the customer mentions the bill increase but accepts it without trying to negotiate: ⭐☆☆☆☆ (1 star)
- If the customer makes minimal effort but gets no reduction: ⭐☆☆☆☆ (1 star)
- If the customer tries to negotiate but only gets a small credit (<$10 off monthly): ⭐⭐☆☆☆ (2 stars)
- If the customer negotiates and gets $10-19 monthly reduction: ⭐⭐⭐☆☆ (3 stars)
- If the customer negotiates well and gets $20+ reduction or back to $69: ⭐⭐⭐⭐☆ (4 stars)
- If the customer negotiates excellently and gets below $69 or significant extras: ⭐⭐⭐⭐⭐ (5 stars)

For outcome, state the final result. If no negotiation happened, say "No negotiation attempted - bill remains at $89/month"

confettiWorthy should be true ONLY if the customer achieved 4 or 5 stars (significant reduction).

\n\n${transcript}`})});
      
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
      
      // Check if score is good enough for leaderboard (2+ stars)
      if (!j.error) {
        const starCount = (j.rating?.match(/⭐/g) || []).length;
        if (starCount >= 2 && !hasSubmittedEmail) {
          // Show email dialog for leaderboard entry
          setShowEmailDialog(true);
        }
      }
    } catch (error) {
      console.error("BN_CLIENT: Error in score function (fetching or parsing JSON):", error);
      setReport({ error: "Failed to fetch or parse score data.", details: String(error) });
    }
  // }, [messages, setReport]);
  }, [setReport, hasSubmittedEmail]); // removed saveScoreToBackend from dependencies

  // agentLogic: Passed to the hook. Seems stable as it uses roleRef and its direct argument.
  // If it were to use other component state/props, it should be memoized with useCallback.
  // async function agentLogic(userText:string){ // Commenting out for now, will be refactored in Phase 3
  //   console.log("BN_CLIENT: agentLogic called. User text:", userText, ". Current roleRef:", roleRef.current, "isRoleChangeStaged:", isRoleChangeStaged, "currentRoleForEffect:", currentRoleForEffect, "isEscalationPending:", isEscalationAcknowledgementPending);
  //   if (/supervisor|manager/i.test(userText)) {
  //     if (roleRef.current === "agent_frontline") {
  //       // Only stage if not already staged for supervisor and not already pending acknowledgement for this escalation
  //       if ((!isRoleChangeStaged || currentRoleForEffect !== "agent_supervisor")) {
  //         console.log("BN_CLIENT: Escalation to supervisor detected. Staging role change from agent_frontline to agent_supervisor.");
  //         setCurrentRoleForEffect("agent_supervisor"); // Set the TARGET role for the upcoming switch
  //         setIsRoleChangeStaged(true);                 // Signal that a switch is pending
  //         setIsEscalationAcknowledgementPending(true); // Signal that we are waiting for the current agent to acknowledge this specific escalation
  //         // DO NOT change roleRef.current here. Let the frontline agent respond first.
  //       } else {
  //         console.log("BN_CLIENT: Escalation to supervisor detected, but change to supervisor is already staged or pending acknowledgement.");
  //       }
  //     } else if (roleRef.current === "agent_supervisor") {
  //       console.log("BN_CLIENT: Escalation detected, but roleRef.current is already agent_supervisor.");
  //     } else {
  //       // This case might occur if roles other than frontline/supervisor are introduced
  //       console.log("BN_CLIENT: Escalation detected, but current role is unexpected:", roleRef.current);
  //     }
  //   }
  // }
  
  // This function is called by the hook when the agent signals call end.
  const handleAgentInitiatedCallEnd = useCallback(() => {
    setIsCallEndedByAgent(true);
    setCallEndedAndNeedsScoring(true);
    // Don't show modal or change phase - just let the report appear below
  }, [setIsCallEndedByAgent, setCallEndedAndNeedsScoring]);

  const handleAgentTransferRequested = useCallback((targetAgentName: string, transferArgs: { reason?: string; conversation_summary?: string }) => {
    console.log(`BN_CLIENT: Agent transfer requested to ${targetAgentName}. Reason: ${transferArgs.reason}, Summary: ${transferArgs.conversation_summary}`);
    
    // Set transfer in progress flag
    setIsTransferInProgress(true);
    
    // Map target agent names to configurations
    if (targetAgentName.includes("supervisor") || targetAgentName === "agent_supervisor" || targetAgentName === supervisorAgentConfig.name) {
      console.log("BN_CLIENT: Setting agent config to supervisor");
      setCurrentAgentConfig(supervisorAgentConfig);
      
      // Show toast notification
      toast({
        title: "Transferring Call",
        description: `Connecting to supervisor: ${supervisorAgentConfig.publicDescription.split(',')[0]}`,
        duration: 3000,
      });
      
      // Force a reconnection after a delay to ensure clean state
      setTimeout(() => {
        console.log("BN_CLIENT: Triggering reconnection after transfer");
        setIsTransferInProgress(false); // Clear the flag to allow reconnection
        // The useEffect watching currentSessionStatus and currentAgentConfig will handle reconnection
      }, 500);
    } else {
      console.error(`BN_CLIENT: Unknown target agent for transfer: ${targetAgentName}`);
      toast({
        title: "Transfer Error",
        description: `Could not find agent: ${targetAgentName}`,
        variant: "destructive",
        duration: 5000,
      });
      
      // Clear transfer flag on error
      setIsTransferInProgress(false);
      
      // Still update the config to trigger reconnection with current agent
      // This prevents the connection from being stuck in a disconnected state
      setCurrentAgentConfig(currentAgentConfig);
    }
  }, [setCurrentAgentConfig, toast, currentAgentConfig, supervisorAgentConfig]);

  // Instantiate the hook
  const {
    connect: realtimeConnect,
    disconnect: realtimeDisconnect,
    userAudioStream, // Get the user's audio stream for visualization
    agentAudioStream, // Get the agent's audio stream for visualization
  } = useRealtimeNegotiation({
    onMessagesUpdate: handleMessagesUpdate,
    onAgentSpeakingChange: handleAgentSpeakingChange,
    onSessionStatusChange: handleSessionStatusChange,
    onUserSpeakingChange: handleUserSpeakingChange,
    currentAgentConfig: currentAgentConfig, // Pass currentAgentConfig to the hook
    // onUserTranscriptCompleted: agentLogic, // Commented out, agentLogic is removed for now
    onUserTranscriptCompleted: (transcript: string) => { console.log("User transcript completed:", transcript); /* Placeholder */ },
    onAgentEndedCall: handleAgentInitiatedCallEnd, // Pass the stable callback
    onAgentTransferRequested: handleAgentTransferRequested, // Add the new callback
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
    // Keep phase as "call" to show report below, just like when agent ends
    // setPhase("report"); // Remove this - we want to stay in call phase
    setIsCallEndedByAgent(true); // Set this to true to show report below
    setCallEndedAndNeedsScoring(true);
    setUserRequestedDisconnect(true); // Signal for useEffect to disconnect
  }, []); // Removed setPhase from dependencies

  /* --- Start connection when phase switches to "call" --- */
  useEffect(() => {
    if (
      phase === "call" &&
      currentSessionStatus === "DISCONNECTED" &&
      !isCallEndedByAgent && // Do not reconnect if agent has ended the call
      !userRequestedDisconnect && // Do not reconnect if user has initiated disconnect
      !isTransferInProgress // Do not reconnect while transfer is being processed
    ) {
      console.log("BN_CLIENT: Phase is call, session disconnected, and call not terminated by agent/user/transfer. Attempting to connect to Realtime API...");
      console.log("BN_CLIENT: Current agent config:", currentAgentConfig.name);
      
      // Track session start time
      if (!sessionStartTime) {
        setSessionStartTime(Date.now());
      }
      
      realtimeConnect();
    }

    // Cleanup on phase change or unmount if connected
    return () => {
      // Only disconnect if the phase is no longer 'call' AND we were connected/connecting.
      // This prevents trying to disconnect an already disconnected session if phase changes while currentSessionStatus is DISCONNECTED.
      if (phase !== "call" && (currentSessionStatus === "CONNECTED" || currentSessionStatus === "CONNECTING")) {
        console.log("BN_CLIENT: Phase changed from call or component unmounting, and session was active. Disconnecting Realtime API...");
        realtimeDisconnect();
      }
    };
  }, [
    phase, 
    currentSessionStatus, 
    realtimeConnect, 
    realtimeDisconnect, 
    isCallEndedByAgent, 
    userRequestedDisconnect,
    isTransferInProgress,
    currentAgentConfig, // Add this to trigger reconnection when agent changes
    sessionStartTime,
    setSessionStartTime
  ]); 
  
  // Effect to handle agent role change (e.g. escalation to supervisor)
  // This effect needs careful management of how roleRef.current changes are propagated if not tied to a state re-render.
  // For now, assuming roleRef.current is updated correctly before this effect is (re)triggered indirectly.
  // const [currentRoleForEffect, setCurrentRoleForEffect] = useState<RealtimeAgentRole>(roleRef.current); // Removed
  // const [isRoleChangeStaged, setIsRoleChangeStaged] = useState<boolean>(false); // Will be handled by agent tool calls

  // Effect to clear the pending acknowledgement flag once the agent starts speaking
  // useEffect(() => { // Commenting out, related to old escalation logic
  //   if (isEscalationAcknowledgementPending && isRealtimeAgentSpeaking) {
  //     console.log("BN_CLIENT: Agent has started speaking, clearing isEscalationAcknowledgementPending.");
  //     setIsEscalationAcknowledgementPending(false);
  //   }
  // }, [isEscalationAcknowledgementPending, isRealtimeAgentSpeaking]);

  // useEffect(() => { // Commenting out the entire role change effect for now, will be refactored in Phase 3
    // Part 2: Execute the Staged Role Change if conditions are met
    // if (
    //   isRoleChangeStaged &&
    //   !isRealtimeAgentSpeaking &&
    //   !isEscalationAcknowledgementPending && // Ensure acknowledgement has been processed
    //   currentSessionStatus === "CONNECTED"
    // ) {
    //   // Current agent (roleRef.current) has finished speaking. Switch to currentRoleForEffect is imminent.
    //   // Client-side injected text message REMOVED. Sarah is expected to say this via server-side prompt.
    //   // if (roleRef.current === "agent_frontline" && currentRoleForEffect === "agent_supervisor") {
    //   //   const ackMsg: Message = {
    //   //     id: "ack-" + Date.now(),
    //   //     role: "Sarah", // This will be displayed as "Sarah:" in the transcript
    //   //     text: "Okay, I'll transfer you to my supervisor now. One moment, please."
    //   //   };
    //   //   setMsgs(prevMsgs => [...prevMsgs, ackMsg]);
    //   //   console.log("BN_CLIENT: Injected transfer acknowledgement message from Sarah into transcript.");
    //   // }
    //   // TODO: Add similar logic if other transfer types are implemented, e.g., supervisor back to frontline.

    //   console.log(
    //     "BN_CLIENT: Role change staged, agent NOT speaking, ack processed, and connected. EXECUTING reconnect to role:",
    //     currentRoleForEffect // This is the target role, e.g., "agent_supervisor"
    //   );

    //   if (roleRef.current !== currentRoleForEffect) {
    //     console.log("BN_CLIENT: Disconnecting for role change. Old role:", roleRef.current, "New role:", currentRoleForEffect);
    //     realtimeDisconnect(); // Disconnect current session

    //     console.log("BN_CLIENT: Updating roleRef.current from", roleRef.current, "to", currentRoleForEffect, "before reconnect.");
    //     roleRef.current = currentRoleForEffect; // Update roleRef to the new target role

    //     console.log("BN_CLIENT: Role change useEffect: Calling realtimeConnect in 100ms with new role:", roleRef.current);
    //     setTimeout(() => realtimeConnect(), 100); // realtimeConnect will use the updated roleRef.current
    //   } else {
    //     console.log("BN_CLIENT: Role change staged, but roleRef.current already matches targetRole. No reconnect needed. Target role:", currentRoleForEffect);
    //   }
    //   setIsRoleChangeStaged(false); // Reset the staged flag
    // } else if (isRoleChangeStaged && isRealtimeAgentSpeaking && currentSessionStatus === "CONNECTED") {
    //   // If acknowledgement is pending, this log is now less relevant as the new useEffect handles the pending state logic first.
    //   // However, this overall condition (staged, speaking, connected) is still valid for general waiting.
    //   if (isEscalationAcknowledgementPending) {
    //     console.log("BN_CLIENT: Role change staged, agent IS SPEAKING. Waiting for acknowledgement to complete (isEscalationAcknowledgementPending will be cleared).");
    //   } else {
    //     console.log("BN_CLIENT: Role change staged, agent IS SPEAKING (acknowledged). Waiting for agent to finish current speech before switching.");
    //   }
    // } else if (isRoleChangeStaged && currentSessionStatus !== "CONNECTED") {
    //   console.log("BN_CLIENT: Role change staged, but session is NOT CONNECTED (" + currentSessionStatus + "). Clearing staged change and pending ack.");
    //   setIsRoleChangeStaged(false); // Reset if we get disconnected while a change is staged
    //   setIsEscalationAcknowledgementPending(false); // Also clear pending acknowledgement
    // } else if (isRoleChangeStaged && isEscalationAcknowledgementPending && !isRealtimeAgentSpeaking) {
    //   console.log("BN_CLIENT: Role change staged, acknowledgement pending, but agent is NOT speaking. Waiting for agent to start acknowledgement.");
    // } else if (!isRoleChangeStaged) {
    //   // This block is for when no role change is staged. Log existing conditions if needed.
    //   // console.log("BN_CLIENT: No role change staged. Current role for effect:", currentRoleForEffect, "Session:", currentSessionStatus);
    // }
  // }, [
    // currentSessionStatus,
    // realtimeConnect,
    // realtimeDisconnect,
    // currentRoleForEffect,    // Holds the target role for the staged change
    // isRealtimeAgentSpeaking,
    // isRoleChangeStaged,
    // isEscalationAcknowledgementPending,
    // setCurrentRoleForEffect and setIsRoleChangeStaged are setters, not needed in deps
  // ]);

  // Effect to handle scoring after call ends
  useEffect(() => {
    if (callEndedAndNeedsScoring) {
      const finalTranscript = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
      console.log("BN_CLIENT: Scoring via useEffect. Transcript for scoring:", finalTranscript);
      score(finalTranscript);
      setCallEndedAndNeedsScoring(false); // Reset the flag
    }
  }, [callEndedAndNeedsScoring, messages, score]);

  // Effect to trigger confetti when successful negotiation is detected
  useEffect(() => {
    console.log("BN_CLIENT: Confetti effect triggered. Report:", report, "Phase:", phase, "IsCallEndedByAgent:", isCallEndedByAgent);
    
    if (report && (phase === "report" || isCallEndedByAgent)) {
      console.log("BN_CLIENT: Report exists and conditions met for confetti check");
      
      // Handle error reports
      if (report.error) {
        console.log("BN_CLIENT: Report contains error, skipping confetti");
        return;
      }
      
      // Parse the report if it's from the API
      let parsed = report;
      
      // If report has a text property, it's from the API and needs parsing
      if (report.text && typeof report.text === "string") {
        console.log("BN_CLIENT: Report has text property, parsing JSON");
        try {
          // Remove any markdown code blocks and parse
          const cleanedText = report.text.replace(/```json\s*|\s*```/g, "").trim();
          parsed = JSON.parse(cleanedText);
          console.log("BN_CLIENT: Successfully parsed report:", parsed);
        } catch (e) {
          console.error("BN_CLIENT: Failed to parse report.text:", e);
          console.error("BN_CLIENT: Raw text was:", report.text);
          return; // Exit if we can't parse
        }
      }
      
      // Now check for confettiWorthy flag
      if (parsed && parsed.confettiWorthy === true) {
        console.log("BN_CLIENT: AI determined this is confetti-worthy! FIRING CONFETTI!");
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          try {
            // Trigger confetti animation
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            console.log("BN_CLIENT: Main confetti burst fired!");
            
            // Additional burst for 5-star ratings
            const ratingStars = (parsed.rating?.match(/⭐/g) || []).length;
            if (ratingStars === 5) {
              setTimeout(() => {
                confetti({
                  particleCount: 50,
                  angle: 60,
                  spread: 55,
                  origin: { x: 0 }
                });
                confetti({
                  particleCount: 50,
                  angle: 120,
                  spread: 55,
                  origin: { x: 1 }
                });
                console.log("BN_CLIENT: Bonus confetti bursts for 5-star rating!");
              }, 250);
            }
          } catch (error) {
            console.error("BN_CLIENT: Confetti error:", error);
          }
        }, 500); // Delay to ensure DOM is ready
      } else {
        console.log("BN_CLIENT: No confetti needed. confettiWorthy:", parsed?.confettiWorthy);
      }
    }
  }, [report, phase, isCallEndedByAgent]);

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

  // Reset leaderboard visibility when starting a new call
  useEffect(() => {
    if (phase === "call" && !isCallEndedByAgent) {
      setShowLeaderboardSection(false);
    }
  }, [phase, isCallEndedByAgent]);

  // Handle email submission for leaderboard
  const handleEmailSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userEmail || !report) return;
    
    setIsSubmittingEmail(true);
    
    try {
      // First, submit to existing waitlist
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      const waitlistResponse = await fetch(`${supabaseUrl}/functions/v1/waitlist-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey || '',
        },
        body: JSON.stringify({ 
          email: userEmail.toLowerCase().trim(),
          source: 'bill-negotiator' // Track where signup came from
        }),
      });
      
      // Save score regardless of waitlist response (they might already be on it)
      const scoreData = await saveScoreToBackend(report, userEmail);
      
      if (scoreData) {
        setHasSubmittedEmail(true);
        setShowEmailDialog(false);
        setShowLeaderboardSection(true); // Show leaderboard after email submission
        
        // Show success message
        toast({
          title: "🎉 You're on the leaderboard!",
          description: `Ranked #${scoreData.rank} out of ${scoreData.totalParticipants} negotiators`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save your score. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Email submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  }, [userEmail, report, saveScoreToBackend, toast]);

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
      
      {/* Add warning box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Demo Limitations</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Maximum 3 practice sessions per hour</li>
              <li>Each call limited to 5 minutes</li>
              <li>This is an AI simulation for educational purposes only</li>
            </ul>
          </div>
        </div>
      </div>

      <Button 
        size="lg" 
        className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
        onClick={() => {
          if (!hasAcceptedTerms) {
            setShowTermsDialog(true);
          } else {
            setPhase("call");
            setActiveDrawerTab("mission");
          }
        }}>
        Get Started
      </Button>

      {/* Terms Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Terms of Use</DialogTitle>
          </DialogHeader>
          <div className="text-left space-y-3 pt-4 text-sm text-muted-foreground">
            <p>
              <strong>Educational Demo Only:</strong> This is a free educational tool to practice negotiation skills. 
              The AI agents simulate customer service representatives and their responses are not real.
            </p>
            
            <div>
              <p className="mb-2">
                <strong>Usage Limits:</strong> To ensure fair access for all users:
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Maximum 3 sessions per hour per user</li>
                <li>Each session limited to 5 minutes</li>
                <li>Sessions may be terminated if idle for 60 seconds</li>
              </ul>
            </div>
            
            <p>
              <strong>Privacy:</strong> We do not store personal information. Session data may be logged 
              for improving the service. Do not share any real personal or financial information.
            </p>
            
            <p>
              <strong>No Guarantees:</strong> Skills learned here may not directly translate to real-world 
              negotiations. Results will vary based on actual service providers and their policies.
            </p>
            
            <p className="text-sm text-gray-600">
              By clicking "I Agree", you acknowledge that you understand and accept these terms.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowTermsDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setHasAcceptedTerms(true);
                setShowTermsDialog(false);
                setPhase("call");
                setActiveDrawerTab("mission");
              }}
            >
              I Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Development Testing Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">🧪 Development Testing</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPhase("call");
                setIsCallEndedByAgent(true);
                setReport({
                  strengths: ["Excellent persistence", "Used multiple negotiation tactics", "Leveraged customer loyalty"],
                  improvements: ["Could have mentioned competitor offers earlier"],
                  outcome: "Outstanding negotiation! Bill reduced from $89 to $64 with premium channels added",
                  rating: "⭐⭐⭐⭐⭐",
                  confettiWorthy: true
                });
                setMsgs([
                  { id: "1", role: "Sarah", text: "Thank you for calling. How can I help?" },
                  { id: "2", role: "user", text: "My bill went up from $69 to $89 without notice. I've been a customer for 8 years." },
                  { id: "3", role: "Sarah", text: "I can offer a $5 loyalty credit." },
                  { id: "4", role: "user", text: "That's not enough. Competitor X offers $55. I need to speak to a supervisor." },
                  { id: "5", role: "Marco", text: "I see your loyalty. I can offer $64/month plus premium channels." },
                  { id: "6", role: "user", text: "That's perfect, thank you!" }
                ]);
              }}
              className="bg-green-100 hover:bg-green-200"
            >
              5⭐ Perfect ($64)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPhase("call");
                setIsCallEndedByAgent(true);
                setReport({
                  strengths: ["Good negotiation", "Stayed professional", "Achieved target price"],
                  improvements: ["Could have pushed for better terms", "Missed opportunity for additional perks"],
                  outcome: "Successfully reduced bill from $89 back to original $69",
                  rating: "⭐⭐⭐⭐☆",
                  confettiWorthy: true
                });
                setMsgs([
                  { id: "1", role: "Sarah", text: "How can I help you today?" },
                  { id: "2", role: "user", text: "My bill increased to $89." },
                  { id: "3", role: "Sarah", text: "After reviewing, I can offer $69 for 12 months." },
                  { id: "4", role: "user", text: "That works for me." }
                ]);
              }}
              className="bg-blue-100 hover:bg-blue-200"
            >
              4⭐ Good ($69)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPhase("call");
                setIsCallEndedByAgent(true);
                setReport({
                  strengths: ["Made an attempt", "Remained polite"],
                  improvements: ["Need to be more assertive", "Should have asked for supervisor", "Didn't mention loyalty or competitors"],
                  outcome: "Minimal success - only got $5 monthly discount, bill now $84",
                  rating: "⭐⭐⭐☆☆",
                  confettiWorthy: false
                });
                setMsgs([
                  { id: "1", role: "Sarah", text: "How can I help?" },
                  { id: "2", role: "user", text: "My bill went up." },
                  { id: "3", role: "Sarah", text: "I can offer $5 off per month." },
                  { id: "4", role: "user", text: "Okay, thanks." }
                ]);
              }}
              className="bg-yellow-100 hover:bg-yellow-200"
            >
              3⭐ Okay ($84)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPhase("call");
                setIsCallEndedByAgent(true);
                setReport({
                  strengths: ["Tried to negotiate"],
                  improvements: ["Too passive", "Gave up too easily", "No leverage used", "Should escalate when hitting resistance"],
                  outcome: "Poor result - only received one-time $10 credit, monthly bill remains $89",
                  rating: "⭐⭐☆☆☆",
                  confettiWorthy: false
                });
                setMsgs([
                  { id: "1", role: "Sarah", text: "How can I help?" },
                  { id: "2", role: "user", text: "Can you lower my bill?" },
                  { id: "3", role: "Sarah", text: "I can only offer a one-time $10 credit." },
                  { id: "4", role: "user", text: "I guess that's better than nothing." }
                ]);
              }}
              className="bg-orange-100 hover:bg-orange-200"
            >
              2⭐ Poor (credit)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPhase("call");
                setIsCallEndedByAgent(true);
                setReport({
                  strengths: ["Attempted to communicate issue"],
                  improvements: ["No negotiation skills shown", "Accepted first answer", "Didn't advocate for yourself", "Failed to use any leverage"],
                  outcome: "Failed negotiation - no reduction achieved, bill remains at $89",
                  rating: "⭐☆☆☆☆",
                  confettiWorthy: false
                });
                setMsgs([
                  { id: "1", role: "Sarah", text: "How can I help?" },
                  { id: "2", role: "user", text: "My bill went up." },
                  { id: "3", role: "Sarah", text: "That's our new standard rate." },
                  { id: "4", role: "user", text: "Oh, okay then." }
                ]);
              }}
              className="bg-red-100 hover:bg-red-200"
            >
              1⭐ Failed ($89)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setPhase("call");
                setIsCallEndedByAgent(true);
                setReport({
                  strengths: ["Got to supervisor", "Mentioned competitors"],
                  improvements: ["Could have been more specific about competitor offers", "Accepted first supervisor offer"],
                  outcome: "Good negotiation - reduced bill to $74 per month",
                  rating: "⭐⭐⭐☆☆",
                  confettiWorthy: false
                });
                setMsgs([
                  { id: "1", role: "Sarah", text: "How can I help?" },
                  { id: "2", role: "user", text: "I need a better rate or I'll switch." },
                  { id: "3", role: "user", text: "Let me speak to a supervisor." },
                  { id: "4", role: "Marco", text: "I can offer $74 per month." },
                  { id: "5", role: "user", text: "Alright, I'll take it." }
                ]);
              }}
              className="bg-purple-100 hover:bg-purple-200"
            >
              3⭐ Decent ($74)
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Test different negotiation outcomes and confetti triggers</p>
        </div>
      )}
    </div>
  )

  const renderScenario = () => (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Bill Just Increased 30%</h1>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
        <div className="flex items-start mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Internet bill: <span className="line-through text-gray-500">$69</span> → <span className="text-red-600">$89/month</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">No notice. No explanation.</p>
          </div>
        </div>
        
        <div className="border-t border-emerald-200 pt-4">
          <h3 className="text-lg font-semibold mb-2 text-emerald-800">Your Mission</h3>
          <p className="text-gray-700">
            Call customer service and negotiate your bill back down. Use any tactics: loyalty, competitors, escalation.
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8 py-6 text-lg"
          onClick={() => {
            if (!hasAcceptedTerms) {
              setShowTermsDialog(true);
            } else {
              setPhase("call");
              setActiveDrawerTab("mission");
            }
          }}>
          <PhoneOff className="mr-2 h-5 w-5" />
          Start Negotiation Call
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          Practice your negotiation skills with AI • 5 min max
        </p>
      </div>
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
        <li><strong>Open strong:</strong> "I've been a loyal customer for X years and I'm shocked by this 30% increase."</li>
        <li><strong>Use competition:</strong> "Xfinity offers $55/month" or "Verizon has plans for $60" - even general pricing helps.</li>
        <li><strong>Don't accept first offer:</strong> If they offer $5 off, say "That's not enough to keep me as a customer."</li>
        <li><strong>Escalate strategically:</strong> "I need to speak with someone who can actually help me" or "Please transfer me to retention."</li>
        <li><strong>Create urgency:</strong> "I'm ready to cancel today unless we can work something out."</li>
        <li><strong>Be specific:</strong> "I want my bill back to $69" gives them a clear target.</li>
        <li><strong>Use silence:</strong> After they make an offer, pause for 3-5 seconds before responding.</li>
        <li><strong>Document everything:</strong> "So you're offering $74/month for 12 months, correct?"</li>
        <li><strong>Know when to push:</strong> If supervisor offers more than frontline, they likely have more room.</li>
        <li><strong>Stay professional:</strong> Firm but polite gets better results than anger.</li>
      </ul>
    </div>
  )

  // Multi-tab Drawer
  const renderDrawer = () => (
    <aside
      className={`
        fixed inset-0 bg-white shadow-lg overflow-y-auto z-50 flex flex-col
        md:absolute md:right-0 md:top-16 md:left-auto md:bottom-auto 
        md:h-[calc(100%-4rem)] md:w-72 md:max-w-[18rem]
        ${activeDrawerTab ? 'block' : 'hidden'}
      `}
    >
      <div className="sticky top-0 z-10 bg-white pb-2 mb-4 border-b border-gray-100 px-4 pt-5 md:pt-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
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
            className="ml-auto text-gray-400 hover:text-gray-700 text-xl font-bold md:block"
            aria-label="Close drawer"
            onClick={()=>setActiveDrawerTab(null)}
          >&times;</button>
        </div>
      </div>
      <div className="flex-1 px-4 pb-4">
        {activeDrawerTab==="transcript" && (
          <div>
            {messages.slice().reverse().map(m=>(
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
    <div className="w-full">
      {/* Desktop layout with leaderboard on right */}
      <div className="hidden md:grid md:grid-cols-[1fr,400px] md:gap-8 max-w-7xl mx-auto">
        {/* Left column - Call interface */}
        <div className="flex flex-col items-center px-4">
          {/* iPhone-ish frame */}
          <div className="relative w-72 h-96 bg-black rounded-[2.5rem] shadow-inner flex flex-col items-center pt-16">
            <p className="text-white/60 text-xs">
              {currentAgentConfig.name.toLowerCase().includes("supervisor") ? "Supervisor" : "Customer Service"}
            </p>
            <h2 className="text-white mt-1">
              {currentAgentConfig.publicDescription.split(",")[0] || currentAgentConfig.name}
            </h2>

            {/* Talking Orb instead of mic button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <TalkingOrb 
                isAgentSpeaking={isRealtimeAgentSpeaking}
                isUserSpeaking={isUserSpeaking}
                size={120}
                userAudioStream={userAudioStream || undefined}
                agentAudioStream={agentAudioStream || undefined}
              />
            </div>

            {/* Connection status indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs">
              {currentSessionStatus === "CONNECTING" && "Connecting..."}
              {currentSessionStatus === "ERROR" && "Connection Error"}
              {currentSessionStatus === "DISCONNECTED" && "Disconnected"}
            </div>
          </div>

          {/* controls */}
          <div className="mt-4 flex items-center gap-4">
            <Button variant="outline" onClick={()=>setActiveDrawerTab("transcript")}> Transcript </Button>
            <Button variant="outline" onClick={()=>setActiveDrawerTab("mission")}> Mission </Button>
            <Button variant="outline" onClick={()=>setActiveDrawerTab("tips")}> Tips </Button>
            <Button
              className={`px-4 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${isCallEndedByAgent ? 'bg-gray-400 hover:bg-gray-500 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              onClick={endCallByUser}
              disabled={isCallEndedByAgent}
            >
              {isCallEndedByAgent ? "Call Ended" : "End Call"}
            </Button>
          </div>

          {/* Drawer for desktop */}
          {activeDrawerTab && renderDrawer()}

          {/* Desktop report - shown below controls */}
          {isCallEndedByAgent && report && (
            <div className="w-full max-w-2xl mt-8">
              <h2 className="text-2xl font-bold mb-4">Negotiation Report</h2>
              {renderReportContent()}
              <Button variant="outline" className="mt-4" onClick={()=>location.reload()}>Try Again</Button>
            </div>
          )}
        </div>

        {/* Right column - Leaderboard (desktop only) */}
        <div className="sticky top-20 h-fit">
          <BillNegotiatorLeaderboard currentUserId={savedScoreData?.userId} />
        </div>
      </div>

      {/* Mobile layout - unchanged */}
      <div className="md:hidden flex flex-col items-center px-4">
        {/* iPhone-ish frame */}
        <div className="relative w-72 h-96 bg-black rounded-[2.5rem] shadow-inner flex flex-col items-center pt-16">
          <p className="text-white/60 text-xs">
            {currentAgentConfig.name.toLowerCase().includes("supervisor") ? "Supervisor" : "Customer Service"}
          </p>
          <h2 className="text-white mt-1">
            {currentAgentConfig.publicDescription.split(",")[0] || currentAgentConfig.name}
          </h2>

          {/* Talking Orb instead of mic button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <TalkingOrb 
              isAgentSpeaking={isRealtimeAgentSpeaking}
              isUserSpeaking={isUserSpeaking}
              size={120}
              userAudioStream={userAudioStream || undefined}
              agentAudioStream={agentAudioStream || undefined}
            />
          </div>

          {/* Connection status indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            {currentSessionStatus === "CONNECTING" && "Connecting..."}
            {currentSessionStatus === "ERROR" && "Connection Error"}
            {currentSessionStatus === "DISCONNECTED" && "Disconnected"}
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 flex items-center gap-4">
          <Button
            className={`px-4 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${isCallEndedByAgent ? 'bg-gray-400 hover:bg-gray-500 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            onClick={endCallByUser}
            disabled={isCallEndedByAgent}
          >
            {isCallEndedByAgent ? "Call Ended" : "End Call"}
          </Button>
        </div>

        {/* Mobile tabs */}
        <div className="w-full mt-6">
          {/* Tab buttons */}
          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeDrawerTab==="transcript" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              onClick={()=>setActiveDrawerTab(activeDrawerTab === "transcript" ? null : "transcript")}
            >Transcript</button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeDrawerTab==="mission" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              onClick={()=>setActiveDrawerTab(activeDrawerTab === "mission" ? null : "mission")}
            >Mission</button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeDrawerTab==="tips" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              onClick={()=>setActiveDrawerTab(activeDrawerTab === "tips" ? null : "tips")}
            >Tips</button>
          </div>

          {/* Tab content OR Report */}
          {isCallEndedByAgent && report ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-bold mb-4">Negotiation Report</h3>
              {renderReportContent()}
              <Button variant="outline" className="mt-4 w-full" onClick={()=>location.reload()}>Try Again</Button>
            </div>
          ) : (
            activeDrawerTab && (
              <div className="bg-white rounded-lg shadow-md p-4 max-h-64 overflow-y-auto">
                {activeDrawerTab==="transcript" && (
                  <div>
                    {messages.slice().reverse().map(m=>(
                      <p key={m.id} className={`text-sm mb-2 ${m.role !== "user" ? "text-gray-800" : "text-blue-600"}`}>
                        <strong>{m.role === "user" ? "You" : m.role}:</strong> {m.text}
                      </p>
                    ))}
                  </div>
                )}
                {activeDrawerTab==="mission" && renderMission()}
                {activeDrawerTab==="tips" && renderTips()}
              </div>
            )
          )}
        </div>
        
        {/* Mobile Leaderboard - collapsible tab below */}
        {(!isCallEndedByAgent || showLeaderboardSection) && (
          <div className="w-full max-w-2xl mt-8 leaderboard-section">
            <button
              onClick={() => setShowLeaderboardSection(!showLeaderboardSection)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
                showLeaderboardSection 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              } ${
                savedScoreData && savedScoreData.rank && !showLeaderboardSection 
                  ? 'animate-pulse' 
                  : ''
              }`}
            >
              <span className="font-medium flex items-center gap-2">
                🏆 Leaderboard
                {savedScoreData && savedScoreData.rank && (
                  <span className="text-sm font-normal">
                    (You're #{savedScoreData.rank})
                  </span>
                )}
              </span>
              <ChevronDown 
                className={`h-5 w-5 transition-transform ${
                  showLeaderboardSection ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {showLeaderboardSection && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                <BillNegotiatorLeaderboard currentUserId={savedScoreData?.userId} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const renderReport = () => {
    // Parse the report if needed
    let parsed = report;
    
    if (report?.text && typeof report.text === "string") {
      try {
        const cleanedText = report.text.replace(/```json\s*|\s*```/g, "").trim();
        parsed = JSON.parse(cleanedText);
      } catch (e) {
        console.error("Failed to parse report:", e);
        parsed = null;
      }
    }
    
    // Extract star count for personalized message
    const starCount = parsed ? (parsed.rating?.match(/⭐/g) || []).length : 0;
    const emptyStarCount = parsed ? (parsed.rating?.match(/☆/g) || []).length : 0;
    const totalStars = Math.max(5, starCount + emptyStarCount);

    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Negotiation Report</h1>
        {parsed ? (
          <>
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
            
            {/* Personalized message and CTA */}
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <p className="text-sm text-gray-700 mb-3">
                {starCount >= 4 && "We noticed you're a skilled negotiator! 🎉"}
                {starCount === 3 && "We noticed you have good negotiation potential! 💪"}
                {starCount === 2 && "We noticed you could benefit from more financial literacy skills. 📚"}
                {starCount === 1 && "We noticed you need to practice your negotiation skills. 🎯"}
                {starCount === 0 && "We noticed you didn't attempt to negotiate. Try speaking up next time! 🗣️"}
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Join Banyan to master money management and negotiation skills.
              </p>
              <a 
                href="https://banyanfinancial.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Join the Waitlist →
              </a>
            </div>
          </>
        ) : (
          <p>Loading…</p>
        )}
        <Button variant="outline" className="mt-6" onClick={()=>location.reload()}>Try Again</Button>
      </div>
    );
  }

  const renderReportContent = () => {
    // Parse the report if needed
    let parsed = report;
    
    if (report?.text && typeof report.text === "string") {
      try {
        const cleanedText = report.text.replace(/```json\s*|\s*```/g, "").trim();
        parsed = JSON.parse(cleanedText);
      } catch (e) {
        console.error("Failed to parse report:", e);
        return <p>Error loading report. Please try again.</p>;
      }
    }

    if (!parsed || parsed.error) {
      return <p>Loading report...</p>;
    }

    // Extract star count for personalized message
    const starCount = parsed ? (parsed.rating?.match(/⭐/g) || []).length : 0;
    const emptyStarCount = parsed ? (parsed.rating?.match(/☆/g) || []).length : 0;
    const totalStars = Math.max(5, starCount + emptyStarCount);

    return (
      <>
        {/* Large star rating display */}
        {parsed.rating && (
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">
              {[...Array(totalStars)].map((_, i) => (
                <span 
                  key={i} 
                  className={`inline-block ${i < starCount ? 'animate-star-appear' : ''}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {i < starCount ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="text-lg font-semibold text-gray-700 animate-fade-in" style={{ animationDelay: `${starCount * 0.2}s` }}>
              {starCount === 5 && "Perfect Negotiation!"}
              {starCount === 4 && "Great Job!"}
              {starCount === 3 && "Good Effort"}
              {starCount === 2 && "Needs Improvement"}
              {starCount === 1 && "Try Again"}
              {starCount === 0 && "No Negotiation Detected"}
            </p>
          </div>
        )}
        
        {/* Quick success message with rank for short attention spans */}
        {savedScoreData && savedScoreData.rank && starCount > 0 && (
          <div className="text-center mb-4 animate-bounce-once">
            <p className="text-2xl">
              {starCount >= 4 ? '🏆' : starCount === 3 ? '🥈' : '💪'} 
              <span className="ml-2 text-lg font-bold text-gray-700">
                You're #{savedScoreData.rank}!
              </span>
            </p>
          </div>
        )}
        
        {/* Percentile display if available */}
        {savedScoreData && savedScoreData.percentile !== null && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-600">
                🎯 You ranked #{savedScoreData.rank || 'N/A'} out of {savedScoreData.totalParticipants} negotiators!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Top {savedScoreData.percentile}% performance
              </p>
              <button
                onClick={() => {
                  setShowLeaderboardSection(true);
                  // Scroll to leaderboard
                  setTimeout(() => {
                    document.querySelector('.leaderboard-section')?.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }, 100);
                }}
                className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 underline font-medium"
              >
                View Full Leaderboard →
              </button>
            </div>
          </div>
        )}
        
        {/* Show email prompt if not submitted and got 2+ stars */}
        {!hasSubmittedEmail && starCount >= 2 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-center font-semibold text-amber-800 mb-2">
              📧 Join the leaderboard!
            </p>
            <p className="text-center text-sm text-amber-700">
              Enter your email to save your score and see how you rank
            </p>
            <button
              onClick={() => setShowEmailDialog(true)}
              className="mt-3 w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-medium"
            >
              Add My Score to Leaderboard
            </button>
          </div>
        )}
        
        {/* For low scores (0-1 stars), don't show leaderboard prompt */}
        {starCount < 2 && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-700">
              💡 Tip: To join the leaderboard, you need to negotiate and achieve at least a 2-star rating!
            </p>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4 overflow-y-auto" style={{maxHeight: 400}}>
          {parsed.outcome && (
              <div>
                <h3 className="font-semibold mb-1">Outcome</h3>
                <p>{parsed.outcome}</p>
              </div>
          )}
          {parsed.strengths && (
            <div>
              <h3 className="font-semibold mb-1">Strengths</h3>
              <ul className="list-disc pl-5">
                {parsed.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {parsed.improvements && (
            <div>
              <h3 className="font-semibold mb-1">Areas for Improvement</h3>
              <ul className="list-disc pl-5">
                {parsed.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
        
        {/* Personalized message and CTA */}
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
          <p className="text-sm text-gray-700 mb-3">
            {starCount >= 4 && "We noticed you're a skilled negotiator! 🎉"}
            {starCount === 3 && "We noticed you have good negotiation potential! 💪"}
            {starCount === 2 && "We noticed you could benefit from more financial literacy skills. 📚"}
            {starCount === 1 && "We noticed you need to practice your negotiation skills. 🎯"}
            {starCount === 0 && "We noticed you didn't attempt to negotiate. Try speaking up next time! 🗣️"}
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-3">
            Join Banyan to master money management and negotiation skills.
          </p>
          <a 
            href="https://banyanfinancial.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Join the Waitlist →
          </a>
        </div>
      </>
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
      
      {/* Email Dialog for Leaderboard */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {savedScoreData ? '🎉 You Made the Leaderboard!' : '🏆 Join the Leaderboard!'}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {savedScoreData ? (
                <>You ranked #{savedScoreData.rank} out of {savedScoreData.totalParticipants} negotiators!</>
              ) : (
                <>Enter your email to save your score and compete with other negotiators</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4 pt-4">
            <div>
              <Input
                type="email"
                placeholder="your@email.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className="w-full"
                disabled={isSubmittingEmail}
              />
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              By submitting, you'll also join the Banyan waitlist for early access
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
                disabled={isSubmittingEmail}
              >
                Skip
              </Button>
              <Button
                type="submit"
                disabled={!userEmail || isSubmittingEmail}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmittingEmail ? 'Saving...' : 'Join Leaderboard'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}