export const SCORING_PROMPT = `You are a negotiation coach. Based only on this transcript, evaluate the customer's negotiation performance. Respond ONLY with a flat JSON object with these keys: strengths (array of strings), improvements (array of strings), outcome (string), rating (string), confettiWorthy (boolean), finalBill (number), reduction (number). Do not nest the result under any other key. 

CRITICAL SCORING RULES:
- If the customer says nothing or only greets without negotiating: ☆☆☆☆☆ (0 stars - display as empty stars)
- If the customer mentions the bill increase but accepts it without trying to negotiate: ⭐☆☆☆☆ (1 star)
- If the customer makes minimal effort but gets no reduction: ⭐☆☆☆☆ (1 star)
- If the customer tries to negotiate but only gets a small credit (<$10 off monthly): ⭐⭐☆☆☆ (2 stars)
- If the customer negotiates and gets $10-19 monthly reduction: ⭐⭐⭐☆☆ (3 stars)
- If the customer negotiates well and gets back to original price $69 exactly: ⭐⭐⭐⭐☆ (4 stars)
- If the customer negotiates excellently and gets below original price (<$69, e.g. $64): ⭐⭐⭐⭐⭐ (5 stars)

For outcome, state the final result in a clear sentence (e.g., "Successfully reduced bill from $89 to $64 per month")

IMPORTANT: Calculate these numeric values:
- finalBill: The final monthly bill amount after negotiation (just the number, e.g., 64 for $64/month)
- reduction: The amount saved per month (e.g., 25 if reduced from $89 to $64)
- For one-time credits, set finalBill to 89 and reduction to 0 (since the monthly bill doesn't change)
- Starting bill is always $89

confettiWorthy should be true ONLY if the customer achieved 4 or 5 stars (significant reduction).`;

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