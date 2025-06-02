-- Create a table for negotiation scores
CREATE TABLE IF NOT EXISTS bill_negotiator_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Anonymous identifier
  score_data JSONB NOT NULL, -- Store the full report
  rating_stars INTEGER NOT NULL CHECK (rating_stars >= 1 AND rating_stars <= 5), -- Star count
  bill_reduction_amount DECIMAL(10,2), -- Amount saved for leaderboard ranking
  final_bill_amount DECIMAL(10,2), -- Final negotiated amount
  initial_bill_amount DECIMAL(10,2) DEFAULT 89.00, -- Starting bill amount
  session_duration INTEGER, -- In seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for leaderboard queries
CREATE INDEX idx_bill_reduction ON bill_negotiator_scores(bill_reduction_amount DESC);
CREATE INDEX idx_rating_stars ON bill_negotiator_scores(rating_stars DESC);
CREATE INDEX idx_created_at ON bill_negotiator_scores(created_at DESC);

-- Create a view for leaderboard with calculated percentiles
CREATE VIEW bill_negotiator_leaderboard AS
SELECT 
  user_id,
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

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON bill_negotiator_scores
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anyone to read scores
CREATE POLICY "Allow public reads" ON bill_negotiator_scores
  FOR SELECT TO anon
  USING (true); 