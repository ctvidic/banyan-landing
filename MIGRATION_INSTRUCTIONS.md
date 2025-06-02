# Bill Negotiator Database Migration

The bill negotiator feature requires database tables that need to be created in your Supabase instance.

## How to Push Migration to Supabase

### Step 1: Login to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Login with email: tom.jacob@superbuilders.school
3. Select your project (banyan-email-signup)

### Step 2: Run the Migration
1. Click on "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy and paste the SQL below:

```sql
-- Create a table for negotiation scores
CREATE TABLE IF NOT EXISTS bill_negotiator_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Anonymous identifier
  email TEXT, -- User email (optional for leaderboard)
  score_data JSONB NOT NULL, -- Store the full report
  rating_stars INTEGER NOT NULL CHECK (rating_stars >= 1 AND rating_stars <= 5), -- Star count
  bill_reduction_amount DECIMAL(10,2), -- Amount saved for leaderboard ranking
  final_bill_amount DECIMAL(10,2), -- Final negotiated amount
  initial_bill_amount DECIMAL(10,2) DEFAULT 89.00, -- Starting bill amount
  session_duration INTEGER, -- In seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_bill_reduction ON bill_negotiator_scores(bill_reduction_amount DESC);
CREATE INDEX IF NOT EXISTS idx_rating_stars ON bill_negotiator_scores(rating_stars DESC);
CREATE INDEX IF NOT EXISTS idx_created_at ON bill_negotiator_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email ON bill_negotiator_scores(email);

-- Create a view for leaderboard with calculated percentiles
CREATE OR REPLACE VIEW bill_negotiator_leaderboard AS
SELECT 
  id,
  user_id,
  email,
  score_data,
  rating_stars,
  bill_reduction_amount,
  final_bill_amount,
  session_duration,
  created_at,
  ROW_NUMBER() OVER (ORDER BY bill_reduction_amount DESC NULLS LAST) as rank,
  PERCENT_RANK() OVER (ORDER BY bill_reduction_amount ASC NULLS FIRST) * 100 as percentile
FROM bill_negotiator_scores;

-- Add RLS policies
ALTER TABLE bill_negotiator_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON bill_negotiator_scores;
DROP POLICY IF EXISTS "Allow public reads" ON bill_negotiator_scores;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON bill_negotiator_scores
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anyone to read scores
CREATE POLICY "Allow public reads" ON bill_negotiator_scores
  FOR SELECT TO anon
  USING (true);
```

4. Click "Run" button

### Step 3: Verify Success
Run this query to verify the tables were created:
```sql
SELECT * FROM bill_negotiator_scores LIMIT 1;
```

You should see an empty result (no error).

## Integration with Existing Waitlist

The bill negotiator now integrates with your existing `waitlist` table:
- When users score 2+ stars, they're prompted to enter email
- Email is saved to both `waitlist` table and `bill_negotiator_scores`
- This creates a smooth user acquisition flow

## Website Configuration

Update your environment variables to match your domain:
```
NEXT_PUBLIC_SITE_URL=https://banyanfinancial.app
``` 