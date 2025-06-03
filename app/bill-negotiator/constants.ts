export const SCORING_PROMPT = `You are a negotiation coach. Analyze the transcript and return ONLY a flat JSON object with these keys: strengths (array), improvements (array), outcome (string), rating (string), confettiWorthy (boolean), finalBill (number), reduction (number).

STEP 1: IDENTIFY THE FINAL DEAL
Read the ENTIRE transcript and find the LAST offer that was:
- Explicitly accepted by customer ("OK", "Deal", "I'll take it", "Yes")
- OR confirmed by agent ("I've applied that to your account")
- OR being discussed when call ended
If NO deal was made, the bill stays at $89.

STEP 2: UNDERSTAND OFFER TYPES (ONLY TWO TYPES EXIST)
Type A - Monthly Discount: "$X off per month" (ongoing, permanent)
Type B - One-Time Credit: "$X credit" (one-time only)

STEP 3: CALCULATE THE FINAL BILL
Starting bill is ALWAYS $89.

For Type A (Monthly Discount):
- If "$20 off per month" → finalBill = 89 - 20 = 69
- If "$10 off per month" → finalBill = 89 - 10 = 79

For Type B (One-Time Credit):
- The monthly bill STAYS at $89
- But for scoring, we spread credit over 12 months
- If "$120 credit" → effective monthly = 89 - (120/12) = 89 - 10 = 79
- If "$60 credit" → effective monthly = 89 - (60/12) = 89 - 5 = 84

STEP 4: ASSIGN STAR RATING
Based on the EFFECTIVE monthly rate:
- $85-89: ⭐ (1 star - minimal savings)
- $80-84: ⭐⭐ (2 stars - small savings)  
- $70-79: ⭐⭐⭐ (3 stars - good savings)
- $69: ⭐⭐⭐⭐ (4 stars - back to original!)
- $59-68: ⭐⭐⭐⭐⭐ (5 stars - beat original!)

Add +0.5 star (round up) if customer successfully escalated to supervisor.

STEP 5: OUTPUT FORMAT
{
  "strengths": ["Clear communication", "Used competition effectively"],
  "improvements": ["Could have escalated sooner", "Didn't mention loyalty"],
  "outcome": "Customer accepted $15/month discount, reducing bill to $74/month",
  "rating": "⭐⭐⭐",
  "starCount": 3,
  "confettiWorthy": false,
  "finalBill": 74,
  "reduction": 15
}

For one-time credits, outcome should specify: "Customer accepted $120 one-time credit (effective $79/month over 12 months)"

IMPORTANT OUTPUT RULES:
- starCount: Must be a number (0-5) matching the star emojis in rating
- confettiWorthy: true if starCount >= 4, false otherwise
- For one-time credits, outcome should specify: "Customer accepted $120 one-time credit (effective $79/month when spread over 12 months)"
- finalBill: For credits, this is the EFFECTIVE rate (e.g., 89 - credit/12), not the actual monthly bill

CRITICAL: Only score the FINAL accepted offer, ignore all rejected offers.`;

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