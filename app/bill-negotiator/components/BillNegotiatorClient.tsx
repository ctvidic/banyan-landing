"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Leaf, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRealtimeNegotiation, SessionStatus as RealtimeSessionStatus } from "../../hooks/useRealtimeNegotiation"
import type { AgentConfig } from "../../banyanAgentConfigs/types"
import { frontlineAgentConfig, supervisorAgentConfig } from "../../banyanAgentConfigs"
import confetti from "canvas-confetti"

// Components
import { IntroPhase } from "./phases/IntroPhase"
import { ScenarioPhase } from "./phases/ScenarioPhase"
import { ReportPhase } from "./phases/ReportPhase"
import { CallPhase } from "./phases/CallPhase"
import { TermsDialog } from "./dialogs/TermsDialog"
import { EmailDialog } from "./dialogs/EmailDialog"
import BillNegotiatorLeaderboard from "./BillNegotiatorLeaderboard"

// Hooks
import { useScoring } from "../hooks/useScoring"
import { useEmailSubmission } from "../hooks/useEmailSubmission"

// Types
type Message = { id: string; role: string; text: string }

export default function BillNegotiatorClientV2() {
  // Phase management
  const [phase, setPhase] = useState<"intro"|"scenario"|"call"|"report">("scenario")
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true)
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [activeDrawerTab, setActiveDrawerTab] = useState<null|"transcript"|"mission"|"tips">(null)

  // Session management
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [showLeaderboardSection, setShowLeaderboardSection] = useState(false)
  
  // Call state
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionStatus, setCurrentSessionStatus] = useState<RealtimeSessionStatus>("DISCONNECTED")
  const [isRealtimeAgentSpeaking, setIsRealtimeAgentSpeaking] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [isCallEndedByAgent, setIsCallEndedByAgent] = useState(false)
  const [userRequestedDisconnect, setUserRequestedDisconnect] = useState(false)
  const [isTransferInProgress, setIsTransferInProgress] = useState(false)
  const [currentAgentConfig, setCurrentAgentConfig] = useState<AgentConfig>(frontlineAgentConfig)
  
  // --- Stage 1: Callbacks with no external hook dependencies ---
  const handleMessagesUpdate = useCallback((newMessages: Message[]) => setMessages(newMessages), [])
  const handleAgentSpeakingChange = useCallback((s: boolean) => setIsRealtimeAgentSpeaking(s), [])
  const handleSessionStatusChange = useCallback((st: RealtimeSessionStatus) => setCurrentSessionStatus(st), [])
  const handleUserSpeakingChange = useCallback((s: boolean) => setIsUserSpeaking(s), [])

  // --- Stage 2: Hooks that depend only on Stage 1 callbacks or props ---
  const { report, score, setReport } = useScoring()
  const { toast } = useToast() // Toast can be initialized early

  // --- Stage 3: Define ALL callbacks needed by useRealtimeNegotiation ---
  // These might now use `toast` if needed, but not `finalOffer` or `useEmailSubmission` outputs yet.

  const onAgentEndedCallCallback = useCallback(() => {
    setIsCallEndedByAgent(true)
    // Actual scoring and dialog showing will be handled by a useEffect watching isCallEndedByAgent & report
  }, [setIsCallEndedByAgent])

  const onAgentTransferRequestedCallback = useCallback((targetAgentName: string, _transferArgs: any) => {
    setIsTransferInProgress(true)
    if (targetAgentName.includes("supervisor") || targetAgentName === supervisorAgentConfig.name) {
      setCurrentAgentConfig(supervisorAgentConfig)
      toast({ title: "Transferring Call", description: `Connecting to supervisor: ${supervisorAgentConfig.publicDescription.split(',')[0]}`, duration: 3000 })
      setTimeout(() => setIsTransferInProgress(false), 500)
    } else {
      console.error("Unknown target agent: ", targetAgentName)
      setIsTransferInProgress(false)
    }
  }, [toast, setIsTransferInProgress, setCurrentAgentConfig])

  // --- Stage 4: useRealtimeNegotiation Hook ---
  const {
    connect: realtimeConnect,
    disconnect: realtimeDisconnect,
    userAudioStream,
    agentAudioStream,
    finalOffer,
  }: {
    connect: () => Promise<void>;
    disconnect: () => void;
    userAudioStream: MediaStream | null;
    agentAudioStream: MediaStream | null;
    finalOffer: { offerType: string; amount: number } | null;
    sessionStatus: RealtimeSessionStatus;
    messages: Message[];
    isAgentSpeaking: boolean;
    isUserSpeaking: boolean;
  } = useRealtimeNegotiation({
    onMessagesUpdate: handleMessagesUpdate,
    onAgentSpeakingChange: handleAgentSpeakingChange,
    onSessionStatusChange: handleSessionStatusChange,
    currentAgentConfig: currentAgentConfig,
    onUserTranscriptCompleted: (transcript: string) => { console.log("User transcript:", transcript); },
    onAgentEndedCall: onAgentEndedCallCallback,
    onAgentTransferRequested: onAgentTransferRequestedCallback,
    onUserSpeakingChange: handleUserSpeakingChange,
  })

  // --- Stage 5: Hooks that depend on useRealtimeNegotiation outputs (like finalOffer) ---
  const { 
    showEmailDialog, setShowEmailDialog,
    userEmail, setUserEmail,
    username, setUsername,
    wantsLeaderboard, setWantsLeaderboard,
    isSubmittingEmail, hasSubmittedEmail,
    savedScoreData, handleEmailSubmit,
  } = useEmailSubmission(report, sessionStartTime, finalOffer as {offerType: string; amount: number} | null)

  // --- Stage 6: useEffects for dependent logic ---
  useEffect(() => {
    if (isCallEndedByAgent && !userRequestedDisconnect && messages.length > 0) { // ensure messages exist before scoring
      // Filter out system messages and non-conversational content
      const conversationalMessages = messages.filter(m => {
        // Exclude system messages
        if (m.text.startsWith("[System:") || m.text.startsWith("[Transcribing") || m.text === "[inaudible]") {
          return false;
        }
        // Exclude simulated messages
        if (m.id.startsWith("simulated-user-") || m.id.startsWith("system-")) {
          return false;
        }
        return true;
      });
      
      if (conversationalMessages.length === 0) {
        console.warn("BN_CLIENT: No conversational messages found for scoring");
        return;
      }
      
      const finalTranscript = conversationalMessages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n")
      console.log("BN_CLIENT: Sending transcript for scoring:", finalTranscript.substring(0, 200) + "...");
      
      score(finalTranscript).then((finalReport) => {
        if (finalReport && !finalReport.error && !hasSubmittedEmail) {
          setShowEmailDialog(true)
        }
      })
    }
  }, [isCallEndedByAgent, userRequestedDisconnect, messages, score, hasSubmittedEmail, setShowEmailDialog])

  // Connection management
  useEffect(() => {
    if (
      phase === "call" &&
      currentSessionStatus === "DISCONNECTED" &&
      !isCallEndedByAgent &&
      !userRequestedDisconnect &&
      !isTransferInProgress
    ) {
      if (!sessionStartTime) {
        setSessionStartTime(Date.now())
      }
      realtimeConnect()
    }
    
    // Disconnect if call has ended
    if (isCallEndedByAgent && (currentSessionStatus === "CONNECTED" || currentSessionStatus === "CONNECTING")) {
      realtimeDisconnect()
    }

    return () => {
      if (phase !== "call" && (currentSessionStatus === "CONNECTED" || currentSessionStatus === "CONNECTING")) {
        realtimeDisconnect()
      }
    }
  }, [phase, currentSessionStatus, realtimeConnect, realtimeDisconnect, isCallEndedByAgent, userRequestedDisconnect, isTransferInProgress, sessionStartTime])

  // Confetti effect
  useEffect(() => {
    if (report && report.confettiWorthy === true && (phase === "report" || isCallEndedByAgent)) {
        setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
        })
            
        if (report.starCount === 5) {
              setTimeout(() => {
            confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } })
            confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } })
          }, 250)
        }
      }, 500)
    }
  }, [report, phase, isCallEndedByAgent])

  // Phase handlers
  const handleTestScenario = (starCount: number) => {
    // Test mode implementation
    setPhase("call")
    setIsCallEndedByAgent(true)
    // Set mock report based on star count
  }

  const handleShowLeaderboard = () => {
    setShowLeaderboardSection(true)
                  setTimeout(() => {
                    document.querySelector('.leaderboard-section')?.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
      })
    }, 100)
  }

  const endCallByUser = useCallback(() => {
    setIsCallEndedByAgent(true)
    setUserRequestedDisconnect(true)
    
    // Disconnect the OpenAI realtime connection immediately
    if (currentSessionStatus === "CONNECTED" || currentSessionStatus === "CONNECTING") {
      realtimeDisconnect()
    }
    
    // Calculate call duration
    const callDuration = sessionStartTime ? (Date.now() - sessionStartTime) / 1000 : 0 // in seconds
    
    // Filter out system messages and non-conversational content
    const conversationalMessages = messages.filter(m => {
      // Exclude system messages
      if (m.text.startsWith("[System:") || m.text.startsWith("[Transcribing") || m.text === "[inaudible]") {
        return false;
      }
      // Exclude simulated messages
      if (m.id.startsWith("simulated-user-") || m.id.startsWith("system-")) {
        return false;
      }
      return true;
    });
    
    // Trigger scoring when user ends call
    const finalTranscript = conversationalMessages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n")
    console.log("BN_CLIENT: User ended call. Transcript for scoring:", finalTranscript.substring(0, 200) + "...");
    
    // Check if user never spoke or only said greeting
    const userMessages = conversationalMessages.filter(m => m.role === "user")
    const hasNegotiated = userMessages.some(m => {
      const text = m.text.toLowerCase()
      // Check if message contains negotiation-related content
      return text.includes("bill") || text.includes("price") || text.includes("$") || 
             text.includes("increase") || text.includes("reduce") || text.includes("discount") ||
             text.includes("expensive") || text.includes("cancel") || text.includes("supervisor")
    })
    
    // If call is under 20 seconds, max 1 star
    if (callDuration < 20 && callDuration > 0) {
      const rushReport = {
        strengths: [],
        improvements: [
          "Call was too short to negotiate effectively",
          "Take more time to build your case",
          "Real negotiations require patience and persistence"
        ],
        outcome: "Rushed call - no meaningful negotiation possible in under 20 seconds",
        rating: userMessages.length === 0 ? "☆☆☆☆☆" : "⭐☆☆☆☆",
        starCount: userMessages.length === 0 ? 0 : 1,
        confettiWorthy: false,
        finalBill: 89,
        reduction: 0
      }
      setReport(rushReport)
      if (!hasSubmittedEmail) {
        setShowEmailDialog(true)
      }
    }
    // If no transcript or no negotiation, ensure 0 stars
    else if (!finalTranscript.trim() || userMessages.length === 0 || !hasNegotiated) {
      const noNegotiationReport = {
        strengths: [],
        improvements: ["Customer did not attempt to negotiate", "Need to speak up about the bill increase"],
        outcome: "No negotiation attempted - bill remains at $89",
        rating: "☆☆☆☆☆",
        starCount: 0,
        confettiWorthy: false,
        finalBill: 89,
        reduction: 0
      }
      setReport(noNegotiationReport)
      if (!hasSubmittedEmail) {
        setShowEmailDialog(true)
      }
    } else {
      // Normal scoring for actual negotiations
      score(finalTranscript).then((finalReport) => {
        if (finalReport && !finalReport.error && !hasSubmittedEmail) {
          setShowEmailDialog(true)
        }
      })
    }
  }, [messages, score, hasSubmittedEmail, setShowEmailDialog, setReport, sessionStartTime, currentSessionStatus, realtimeDisconnect])

  // Main render
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-gray-100/20">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-emerald-600"/>
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
              Banyan
            </span>
          </Link>
        </div>
      </header>

      {/* Body */}
      <section className="py-16 flex-grow">
        <div className="container">
          {phase === "intro" && (
            <IntroPhase 
              onStart={() => setPhase("call")}
              hasAcceptedTerms={hasAcceptedTerms}
              onShowTermsDialog={() => setShowTermsDialog(true)}
              showTestPanel={true}
              onTestScenario={handleTestScenario}
            />
          )}
          
          {phase === "scenario" && (
            <ScenarioPhase
              onStart={() => {
                setPhase("call")
                setActiveDrawerTab("mission")
              }}
              hasAcceptedTerms={hasAcceptedTerms}
              onShowTermsDialog={() => setShowTermsDialog(true)}
            />
          )}
          
          {phase === "call" && (
            <CallPhase
              messages={messages}
              currentSessionStatus={currentSessionStatus}
              isRealtimeAgentSpeaking={isRealtimeAgentSpeaking}
              isUserSpeaking={isUserSpeaking}
              isCallEndedByAgent={isCallEndedByAgent}
              currentAgentConfig={currentAgentConfig}
              userAudioStream={userAudioStream || undefined}
              agentAudioStream={agentAudioStream || undefined}
              report={report}
              savedScoreData={savedScoreData}
              hasSubmittedEmail={hasSubmittedEmail}
              onEndCall={endCallByUser}
              onShowEmailDialog={() => setShowEmailDialog(true)}
              onShowLeaderboard={handleShowLeaderboard}
              showLeaderboardSection={showLeaderboardSection}
              setShowLeaderboardSection={setShowLeaderboardSection}
            />
          )}
          
          {phase === "report" && (
            <ReportPhase
              report={report}
              hasSubmittedEmail={hasSubmittedEmail}
              savedScoreData={savedScoreData}
              onShowEmailDialog={() => setShowEmailDialog(true)}
              onShowLeaderboard={handleShowLeaderboard}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-100">
        <div className="container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Banyan Financial Education. All rights reserved.
        </div>
      </footer>
      
      {/* Dialogs */}
      <TermsDialog 
        open={showTermsDialog}
        onOpenChange={setShowTermsDialog}
        onAccept={() => {
          setHasAcceptedTerms(true)
          setShowTermsDialog(false)
          setPhase("call")
          setActiveDrawerTab("mission")
        }}
      />
      
      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        report={report}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        username={username}
        setUsername={setUsername}
        wantsLeaderboard={wantsLeaderboard}
        setWantsLeaderboard={setWantsLeaderboard}
        isSubmittingEmail={isSubmittingEmail}
        onSubmit={handleEmailSubmit}
      />
    </main>
  )
}