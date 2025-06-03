export const SCORING_PROMPT = `You are a negotiation coach. Analyze the transcript and return ONLY a flat JSON object with these keys: strengths (array), improvements (array), outcome (string), rating (string), confettiWorthy (boolean), finalBill (number), reduction (number).

STEP 1: IDENTIFY THE FINAL DEAL
Read the ENTIRE transcript and find the LAST offer that was:
- Explicitly accepted by customer ("OK", "Deal", "I'll take it", "Yes")
- OR confirmed by agent ("I've applied that to your account")
- OR being discussed when call ended
If NO deal was made, the bill stays at $89.

STEP 2: UNDERSTAND OFFER TYPES (ONLY TWO TYPES EXIST)
Type A - Monthly Discount: Contains "off per month" or "off your bill" or "/month off"
Type B - One-Time Credit: Contains "credit" or "one-time" (NO monthly reduction)

CRITICAL: DO NOT CONFUSE THESE TWO TYPES!
- "$60 credit" is NOT the same as "$60 off per month"
- "$60 credit" = Type B (one-time)
- "$60 off per month" = Type A (monthly)

STEP 3: CALCULATE THE FINAL BILL
Starting bill is ALWAYS $89.

For Type A (Monthly Discount):
- Customer's actual new monthly bill = $89 - discount
- Example: "$20 off per month" → finalBill = 89 - 20 = 69
- Example: "$10 off per month" → finalBill = 89 - 10 = 79

For Type B (One-Time Credit):
- Customer's actual monthly bill STAYS at $89
- For scoring only: effective rate = $89 - (credit ÷ 12)
- Example: "$120 credit" → effective = 89 - (120÷12) = 89 - 10 = 79
- Example: "$60 credit" → effective = 89 - (60÷12) = 89 - 5 = 84
- Example: "$30 credit" → effective = 89 - (30÷12) = 89 - 2.50 = 86.50

STEP 4: ASSIGN STAR RATING
Based on the EFFECTIVE monthly rate:
- $85-89: ⭐ (1 star - minimal savings)
- $80-84: ⭐⭐ (2 stars - small savings)  
- $70-79: ⭐⭐⭐ (3 stars - good savings)
- $69: ⭐⭐⭐⭐ (4 stars - back to original!)
- $59-68: ⭐⭐⭐⭐⭐ (5 stars - beat original!)

Add +0.5 star (round up) if customer successfully escalated to supervisor.

STEP 5: OUTPUT FORMAT AND RULES

For Monthly Discounts (Type A), your outcome MUST say:
"Customer accepted $[X] off per month, reducing bill from $89 to $[Y]/month"

For One-Time Credits (Type B), your outcome MUST say:
"Customer accepted $[X] one-time credit (bill stays $89/month, but effective rate is $[Y]/month when spread over 12 months)"

Example outputs:

For $20/month discount:
{
  "strengths": ["Used competition effectively", "Escalated to supervisor"],
  "improvements": ["Could have mentioned loyalty earlier"],
  "outcome": "Customer accepted $20 off per month, reducing bill from $89 to $69/month",
  "rating": "⭐⭐⭐⭐",
  "starCount": 4,
  "confettiWorthy": true,
  "finalBill": 69,
  "reduction": 20
}

For $60 credit:
{
  "strengths": ["Clear communication", "Persistent"],
  "improvements": ["Should have pushed for monthly discount instead of credit"],
  "outcome": "Customer accepted $60 one-time credit (bill stays $89/month, but effective rate is $84/month when spread over 12 months)",
  "rating": "⭐⭐",
  "starCount": 2,
  "confettiWorthy": false,
  "finalBill": 84,
  "reduction": 5
}

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