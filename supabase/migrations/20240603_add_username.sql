-- Add username column to bill_negotiator_scores table
ALTER TABLE bill_negotiator_scores 
ADD COLUMN IF NOT EXISTS username TEXT;

-- Add index for username lookups
CREATE INDEX IF NOT EXISTS idx_username ON bill_negotiator_scores(username);

-- Recreate the view to include username
DROP VIEW IF EXISTS bill_negotiator_leaderboard;

CREATE VIEW bill_negotiator_leaderboard AS
SELECT 
  id,
  user_id,
  email,
  username,
  score_data,
  rating_stars,
  bill_reduction_amount,
  final_bill_amount,
  session_duration,
  created_at,
  ROW_NUMBER() OVER (ORDER BY bill_reduction_amount DESC NULLS LAST) as rank,
  PERCENT_RANK() OVER (ORDER BY bill_reduction_amount ASC NULLS FIRST) * 100 as percentile
FROM bill_negotiator_scores; 