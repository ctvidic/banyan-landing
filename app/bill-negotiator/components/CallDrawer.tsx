import React from 'react';

interface Message {
  id: string;
  role: string;
  text: string;
}

interface CallDrawerProps {
  activeTab: 'transcript' | 'mission' | 'tips' | null;
  onTabChange: (tab: 'transcript' | 'mission' | 'tips' | null) => void;
  messages: Message[];
  isMobile?: boolean;
}

export function CallDrawer({ activeTab, onTabChange, messages, isMobile = false }: CallDrawerProps) {
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

  if (isMobile) {
    return null; // Mobile version is handled differently in CallPhase
  }

  if (!activeTab) return null;

  return (
    <aside className="fixed inset-0 bg-white shadow-lg overflow-y-auto z-50 flex flex-col md:absolute md:right-0 md:top-16 md:left-auto md:bottom-auto md:h-[calc(100%-4rem)] md:w-72 md:max-w-[18rem]">
      <div className="sticky top-0 z-10 bg-white pb-2 mb-4 border-b border-gray-100 px-4 pt-5 md:pt-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === "transcript" ? "bg-emerald-100 text-emerald-700" : "text-gray-500"}`}
              onClick={() => onTabChange("transcript")}
            >Transcript</button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === "mission" ? "bg-emerald-100 text-emerald-700" : "text-gray-500"}`}
              onClick={() => onTabChange("mission")}
            >Mission</button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${activeTab === "tips" ? "bg-emerald-100 text-emerald-700" : "text-gray-500"}`}
              onClick={() => onTabChange("tips")}
            >Tips</button>
          </div>
          <button
            className="ml-auto text-gray-400 hover:text-gray-700 text-xl font-bold md:block"
            aria-label="Close drawer"
            onClick={() => onTabChange(null)}
          >&times;</button>
        </div>
      </div>
      <div className="flex-1 px-4 pb-4">
        {activeTab === "transcript" && (
          <div>
            {messages.slice().reverse().map(m => (
              <p key={m.id} className={`text-sm mb-2 ${m.role !== "user" ? "text-gray-800" : "text-blue-600"}`}>
                <strong>{m.role === "user" ? "You" : m.role}:</strong> {m.text}
              </p>
            ))}
          </div>
        )}
        {activeTab === "mission" && renderMission()}
        {activeTab === "tips" && renderTips()}
      </div>
    </aside>
  );
} 