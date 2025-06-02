export const SCORING_PROMPT = `You are a negotiation coach. Based only on this transcript, evaluate the customer's negotiation performance. Respond ONLY with a flat JSON object with these keys: strengths (array of strings), improvements (array of strings), outcome (string), rating (string), confettiWorthy (boolean), finalBill (number), reduction (number). Do not nest the result under any other key. 

CRITICAL SCORING RULES:
- If the customer says nothing or only greets without negotiating: ☆☆☆☆☆ (0 stars)
- If the customer accepts the increase or gives up easily: ⭐☆☆☆☆ (1 star)
- If the customer negotiates but only gets minor concessions: ⭐⭐☆☆☆ (2 stars)
- If the customer achieves moderate savings ($10-20 off): ⭐⭐⭐☆☆ (3 stars)  
- If the customer gets back to original $69 price: ⭐⭐⭐⭐☆ (4 stars)
- If the customer gets below $69 (e.g. $64) or exceptional value: ⭐⭐⭐⭐⭐ (5 stars)

SCORING SPECIAL CASES:
- Autopay discount ($5 off): Count toward total reduction
- Bundles: Score based on internet portion only
- Speed upgrades at same price: Add 0.5 stars (round up)
- Multi-month varying offers: Use average monthly rate
- One-time credits: Don't count toward star rating unless combined with monthly savings

ADVANCED NEGOTIATION POINTS (can improve star rating):
- Successfully escalated to supervisor: +0.5 stars
- Used competitor offers effectively: +0.5 stars  
- Negotiated contract terms (not just price): +0.5 stars
- Got price lock guarantee: +0.5 stars
- Avoided long-term commitment for good price: +1 star

For outcome, be specific about what they achieved (e.g., "$69/month for 12 months with 24-month price lock" or "Free speed upgrade to 1Gbps plus $10/month discount")

IMPORTANT: Calculate these numeric values:
- finalBill: The average monthly bill after all discounts/credits
- reduction: Average monthly savings (starting from $89)
- For complex offers, calculate the average over the offer period

confettiWorthy should be true for 4-5 stars OR exceptional negotiation skills shown.`;

export const SCENARIO_CONFIG = {
  startingBill: 89,
  originalBill: 69,
  title: "Your Bill Just Increased 30%",
  description: "Internet bill: $69 → $89/month",
  subtitle: "No notice. No explanation."
};

export const STAR_MESSAGES = {
  5: "Perfect Negotiation!",
  4: "Great Job!",
  3: "Good Effort",
  2: "Needs Improvement",
  1: "Try Again",
  0: "No Negotiation Detected"
};

export const STAR_PERSONALIZED_MESSAGES = {
  5: "We noticed you're a skilled negotiator! 🎉",
  4: "We noticed you're a skilled negotiator! 🎉",
  3: "We noticed you have good negotiation potential! 💪",
  2: "We noticed you could benefit from more financial literacy skills. 📚",
  1: "We noticed you need to practice your negotiation skills. 🎯",
  0: "Don't give up! Speaking up is the first step to saving money. 💬"
};

export const DEMO_LIMITATIONS = {
  maxSessions: 3,
  sessionDuration: 5,
  warningText: "Demo Limitations"
}; 