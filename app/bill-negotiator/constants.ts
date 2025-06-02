export const SCORING_PROMPT = `You are a negotiation coach evaluating customer performance. Analyze the transcript and return ONLY a flat JSON object with these keys: strengths (array), improvements (array), outcome (string), rating (string), confettiWorthy (boolean), finalBill (number), reduction (number), dealStructure (object).

CALCULATING EFFECTIVE MONTHLY RATE:
1. One-time credits: Spread over 12 months (e.g., $120 credit = $10/month reduction for a year)
2. Varying monthly rates: Calculate weighted average (e.g., "$64 for 6 months, then $74 for 6 months" = $69 average)
3. Limited-time discounts: Consider full term impact (e.g., "$10 off for 6 months" = $5/month average over a year)
4. Autopay: Include in calculations (reduces bill by $5/month)
5. Bundle pricing: Only count internet portion, not TV/mobile add-ons

STAR RATING BASED ON EFFECTIVE MONTHLY RATE:
- No negotiation attempted: ☆☆☆☆☆ (0 stars)
- Only got one-time credit or minimal reduction (effective $85+): ⭐☆☆☆☆ (1 star)
- Small ongoing reduction (effective $80-84): ⭐⭐☆☆☆ (2 stars)
- Moderate reduction (effective $70-79): ⭐⭐⭐☆☆ (3 stars)
- Back to original price (effective $69): ⭐⭐⭐⭐☆ (4 stars)
- Below original price (effective <$69): ⭐⭐⭐⭐⭐ (5 stars)

BONUS MODIFIERS (can increase rating by 0.5-1 star):
- Successfully escalated to supervisor: +0.5
- Negotiated favorable contract terms: +0.5
- Got price lock beyond offer period: +0.5
- Avoided long commitment for good price: +1

REQUIRED CALCULATIONS:
finalBill: The EFFECTIVE average monthly rate over 12 months
reduction: Average monthly savings from $89
dealStructure: {
  type: "simple" | "graduated" | "complex",
  details: "e.g., $74/month for 12 months" | "$64 for 6mo, then $74 for 6mo",
  contractLength: number (in months),
  hasAutopay: boolean,
  oneTimeCredits: number,
  effectiveMonthlyRate: number
}

Example calculations:
- "$20 one-time credit + $5/month off" = $84 - ($20/12) = $82.33 effective
- "$64 for 6 months, then $79 for 6 months" = (64*6 + 79*6)/12 = $71.50 effective
- "$10 off for 6 months only" = (79*6 + 89*6)/12 = $84 effective

For outcome, describe EXACTLY what deal was achieved with all terms.`;

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