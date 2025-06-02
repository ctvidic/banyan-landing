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
      <p className="text-gray-700">
        Try to get your bill reduced back to the original price or negotiate for additional services to justify the price increase.
      </p>
    </div>
  );

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