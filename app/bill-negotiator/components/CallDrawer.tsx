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
      <h3 className="font-semibold mb-2">Negotiation Strategy Guide</h3>
      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
        <li><strong>Open Strong:</strong> "I've been a loyal customer for X years. This 30% increase with no notice is unacceptable."</li>
        <li><strong>Use Competition:</strong> "AT&T offers $55/month" or "Verizon has $60 plans" - mention specific competitors and prices.</li>
        <li><strong>Reject Low Offers:</strong> If offered only $5 off: "That's not enough. I need you to do better or transfer me to someone who can."</li>
        <li><strong>Escalate Fast:</strong> "I need to speak with retention or a supervisor who has real authority to help me."</li>
        <li><strong>Be Clear:</strong> "I want my bill back to $69 or I'm canceling today."</li>
        <li><strong>Understand Credits:</strong> A "$60 credit" only saves you $5/month over a year. Push for monthly discounts instead.</li>
        <li><strong>Know the Levels:</strong> Frontline max is $20 off. Supervisors can do $30 off. Don't settle for less than you deserve.</li>
        <li><strong>Magic Words:</strong> With supervisor: "What's your best retention offer?" and "What will it take to keep me?"</li>
        <li><strong>Close the Deal:</strong> When you get a good offer: "OK, I'll accept that. Please confirm the new rate."</li>
      </ul>
      <div className="mt-3 p-2 bg-amber-50 rounded text-xs">
        <strong>Quick Guide:</strong> Credits are worse than Monthly Discounts. Supervisors have more power than Frontline. Goal: Get to $69 or below!
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