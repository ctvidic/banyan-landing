import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { TalkingOrb } from '@/app/components/TalkingOrb';
import { CallDrawer } from '../CallDrawer';
import { ReportPhase } from './ReportPhase';
import BillNegotiatorLeaderboard from '../BillNegotiatorLeaderboard';
import type { AgentConfig } from '../../../banyanAgentConfigs/types';

interface CallPhaseProps {
  messages: Array<{ id: string; role: string; text: string }>;
  currentSessionStatus: string;
  isRealtimeAgentSpeaking: boolean;
  isUserSpeaking: boolean;
  isCallEndedByAgent: boolean;
  currentAgentConfig: AgentConfig;
  userAudioStream?: MediaStream;
  agentAudioStream?: MediaStream;
  report: any;
  savedScoreData: any;
  hasSubmittedEmail: boolean;
  onEndCall: () => void;
  onShowEmailDialog: () => void;
  onShowLeaderboard: () => void;
  showLeaderboardSection: boolean;
  setShowLeaderboardSection: (show: boolean) => void;
}

export function CallPhase({
  messages,
  currentSessionStatus,
  isRealtimeAgentSpeaking,
  isUserSpeaking,
  isCallEndedByAgent,
  currentAgentConfig,
  userAudioStream,
  agentAudioStream,
  report,
  savedScoreData,
  hasSubmittedEmail,
  onEndCall,
  onShowEmailDialog,
  onShowLeaderboard,
  showLeaderboardSection,
  setShowLeaderboardSection
}: CallPhaseProps) {
  const [activeDrawerTab, setActiveDrawerTab] = useState<null|"transcript"|"mission"|"tips">(null);

  const renderMission = () => (
    <div>
      <h3 className="font-semibold mb-2">Your Scenario</h3>
      <p className="text-gray-700 mb-4">
        You notice your internet bill has increased from $69 to $89 per month without any prior notification. You're calling customer service to get this resolved.
      </p>
      <h4 className="font-semibold mb-1">Your Goal</h4>
      <p className="text-gray-700 mb-2">
        Negotiate your bill back down. The agent will use various retention tactics to minimize discounts.
      </p>
      <p className="text-sm text-gray-600 bg-amber-50 p-2 rounded">
        💡 Remember: The best deals (like $64/month) require persistence, escalation to a supervisor, and strong negotiation.
      </p>
    </div>
  );

  const renderTips = () => (
    <div>
      <h3 className="font-semibold mb-2">Advanced Negotiation Playbook</h3>
      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
        <li><strong>The Loyalty Opener:</strong> "I've been a customer for X years, paying on time, and this 30% increase with no notice is unacceptable."</li>
        <li><strong>Competition Card:</strong> "AT&T offered me $55/month" or "Xfinity has 400Mbps for $60" - specific speeds/prices help.</li>
        <li><strong>Reject & Escalate:</strong> When offered $5 off: "That's insulting for a loyal customer. I need to speak with retention/supervisor."</li>
        <li><strong>Bundle Defense:</strong> "I only need internet. Don't try to sell me services I don't want to justify your price increase."</li>
        <li><strong>The Ultimatum:</strong> "I have the competitor's number ready. Either match my old rate or I'm switching today."</li>
        <li><strong>Contract Negotiation:</strong> "I'll accept $74 but with no contract" or "I want a 24-month price lock guarantee."</li>
        <li><strong>Speed Play:</strong> "I don't need faster speeds. I was happy with 100Mbps at $69."</li>
        <li><strong>Calculate Total:</strong> If offered credits: "So that's $20 credit plus $5 off = effectively $84 this month, then $84 ongoing?"</li>
        <li><strong>Supervisor Magic Words:</strong> "What's your best retention offer?" and "What would it take to keep me as a customer?"</li>
        <li><strong>The Close:</strong> When you get $69 or better: "OK, I'll accept that. Please email confirmation of this rate and terms."</li>
      </ul>
      <div className="mt-3 p-2 bg-amber-50 rounded text-xs">
        <strong>Pro tip:</strong> The supervisor has more authority. If the frontline agent won't budge after 2-3 attempts, escalate immediately.
      </div>
    </div>
  );

  return (
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
            userAudioStream={userAudioStream}
            agentAudioStream={agentAudioStream}
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
        <Button variant="outline" onClick={() => setActiveDrawerTab("transcript")} className="hidden md:inline-flex">
          Transcript
        </Button>
        <Button variant="outline" onClick={() => setActiveDrawerTab("mission")} className="hidden md:inline-flex">
          Mission
        </Button>
        <Button variant="outline" onClick={() => setActiveDrawerTab("tips")} className="hidden md:inline-flex">
          Tips
        </Button>
        <Button
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isCallEndedByAgent 
              ? 'bg-gray-400 hover:bg-gray-500 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          onClick={onEndCall}
          disabled={isCallEndedByAgent}
        >
          {isCallEndedByAgent ? "Call Ended" : "End Call"}
        </Button>
      </div>

      {/* Desktop drawer - hidden on mobile */}
      <div className="hidden md:block">
        <CallDrawer 
          activeTab={activeDrawerTab}
          onTabChange={setActiveDrawerTab}
          messages={messages}
        />
      </div>

      {/* Mobile tabs - shown below call interface on mobile */}
      <div className="md:hidden w-full mt-6">
        {/* Tab buttons */}
        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeDrawerTab === "transcript" 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveDrawerTab(activeDrawerTab === "transcript" ? null : "transcript")}
          >
            Transcript
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeDrawerTab === "mission" 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveDrawerTab(activeDrawerTab === "mission" ? null : "mission")}
          >
            Mission
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeDrawerTab === "tips" 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveDrawerTab(activeDrawerTab === "tips" ? null : "tips")}
          >
            Tips
          </button>
        </div>

        {/* Tab content OR Report */}
        {isCallEndedByAgent && report ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold mb-4">Negotiation Report</h3>
            <ReportPhase
              report={report}
              hasSubmittedEmail={hasSubmittedEmail}
              savedScoreData={savedScoreData}
              onShowEmailDialog={onShowEmailDialog}
              onShowLeaderboard={onShowLeaderboard}
              showInline={true}
            />
          </div>
        ) : (
          activeDrawerTab && (
            <div className="bg-white rounded-lg shadow-md p-4 max-h-64 overflow-y-auto">
              {activeDrawerTab === "transcript" && (
                <div>
                  {messages.slice().reverse().map(m => (
                    <p key={m.id} className={`text-sm mb-2 ${
                      m.role !== "user" ? "text-gray-800" : "text-blue-600"
                    }`}>
                      <strong>{m.role === "user" ? "You" : m.role}:</strong> {m.text}
                    </p>
                  ))}
                </div>
              )}
              {activeDrawerTab === "mission" && renderMission()}
              {activeDrawerTab === "tips" && renderTips()}
            </div>
          )
        )}
      </div>

      {/* Desktop report - shown below on desktop */}
      {isCallEndedByAgent && report && (
        <div className="hidden md:block w-full max-w-2xl mt-8">
          <h2 className="text-2xl font-bold mb-4">Negotiation Report</h2>
          <ReportPhase
            report={report}
            hasSubmittedEmail={hasSubmittedEmail}
            savedScoreData={savedScoreData}
            onShowEmailDialog={onShowEmailDialog}
            onShowLeaderboard={onShowLeaderboard}
            showInline={true}
          />
        </div>
      )}
      
      {/* Leaderboard Section - collapsible tab below call */}
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
    </div>
  );
} 