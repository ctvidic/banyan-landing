export const SCORING_PROMPT = `You are a negotiation coach evaluating customer performance. Analyze the transcript and return ONLY a flat JSON object with these keys: strengths (array), improvements (array), outcome (string), rating (string), confettiWorthy (boolean), finalBill (number), reduction (number), dealStructure (object).

CRITICAL: IDENTIFY THE FINAL ACCEPTED DEAL
1. Read through the ENTIRE transcript
2. Identify ALL offers made by the agent(s)
3. Find the LAST offer that the customer either:
   - Explicitly accepted ("OK", "I'll take it", "That works", "Deal", etc.)
   - Implicitly accepted (agent says "I've applied that to your account")
   - Was discussing when the call ended
4. IGNORE all previous offers that were rejected or superseded
5. If no deal was accepted, use the current bill of $89

CALCULATING EFFECTIVE MONTHLY RATE (for the FINAL deal only):
1. One-time credits: Spread over 12 months (e.g., $120 credit = $10/month reduction)
2. Varying monthly rates: Calculate weighted average (e.g., "$64 for 6 months, then $74 for 6 months" = $69 average)
3. Limited-time discounts: Consider full term impact (e.g., "$10 off for 6 months" = $5/month average over a year)
4. Autopay: Include if part of final deal (reduces bill by $5/month)
5. Bundle pricing: Only count internet portion, not TV/mobile add-ons

STAR RATING BASED ON FINAL DEAL'S EFFECTIVE RATE:
- No deal accepted/negotiation failed: ☆☆☆☆☆ (0 stars)
- Minimal reduction (effective $85+): ⭐☆☆☆☆ (1 star)
- Small reduction (effective $80-84): ⭐⭐☆☆☆ (2 stars)
- Moderate reduction (effective $70-79): ⭐⭐⭐☆☆ (3 stars)
- Back to original price (effective $69): ⭐⭐⭐⭐☆ (4 stars)
- Below original price (effective <$69): ⭐⭐⭐⭐⭐ (5 stars)

BONUS MODIFIERS:
- Successfully escalated to supervisor: +0.5
- Negotiated contract terms favorably: +0.5
- Got price lock guarantee: +0.5
- Avoided long commitment for good price: +1

REQUIRED OUTPUT:
finalBill: The EFFECTIVE monthly rate of the FINAL ACCEPTED deal over 12 months
reduction: Average monthly savings from $89 based on FINAL deal
dealStructure: {
  type: "simple" | "graduated" | "complex" | "none",
  details: Description of FINAL accepted deal (e.g., "$74/month for 12 months"),
  contractLength: number (in months) or 0 if no commitment,
  hasAutopay: boolean,
  oneTimeCredits: number (total credits in final deal),
  effectiveMonthlyRate: number (same as finalBill)
}

EXAMPLES OF FINAL DEAL IDENTIFICATION:
Transcript excerpt: "I can offer $5 off..." Customer: "That's not enough" ... "How about $10 off for 6 months?" Customer: "I need better" ... "Best I can do is $69/month for 12 months" Customer: "OK I'll take that"
→ FINAL DEAL: $69/month for 12 months (ignore the $5 and $10 offers)

For outcome, describe ONLY the final accepted deal with all its terms.`;

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