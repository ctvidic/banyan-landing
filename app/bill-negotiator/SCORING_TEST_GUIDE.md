# Bill Negotiator - Scoring Test Guide

## Quick Tests to Verify Correct Scoring

### Test 1: One-Time Credit ($60)
**What to say:** Accept a $60 credit offer
**Expected Result:**
- Outcome: "Customer accepted $60 one-time credit (bill stays $89/month, but effective rate is $84/month when spread over 12 months)"
- Final Bill: $84
- Reduction: $5
- Stars: ⭐⭐ (2 stars)

### Test 2: Monthly Discount ($10 off)
**What to say:** Accept a $10/month discount
**Expected Result:**
- Outcome: "Customer accepted $10 off per month, reducing bill from $89 to $79/month"
- Final Bill: $79
- Reduction: $10
- Stars: ⭐⭐⭐ (3 stars)

### Test 3: Best Deal ($30 off with supervisor)
**What to say:** Escalate to supervisor and get $30 off
**Expected Result:**
- Outcome: "Customer accepted $30 off per month, reducing bill from $89 to $59/month"
- Final Bill: $59
- Reduction: $30
- Stars: ⭐⭐⭐⭐⭐ (5 stars + bonus)

## Common Scoring Errors to Watch For

1. **Credit Confusion**: If you accept a "$60 credit" but report shows "$60 off per month", the AI misidentified the offer type.

2. **Wrong Math**: 
   - $60 credit should = $84 effective rate (not $79)
   - $120 credit should = $79 effective rate (not $69)

3. **Multiple Offers**: Only the FINAL accepted offer should be scored, not a combination.

## If Scoring Is Wrong

The system now has explicit rules to distinguish:
- Credits: One-time payment, bill stays $89
- Discounts: Monthly reduction, bill actually changes

If you still see errors after these updates, the issue might be in the transcript interpretation rather than the math. 