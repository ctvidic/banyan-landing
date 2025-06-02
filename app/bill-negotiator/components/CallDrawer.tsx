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