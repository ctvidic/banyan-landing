-- Update the leaderboard view to only show the best score per email/username combination
DROP VIEW IF EXISTS bill_negotiator_leaderboard;

CREATE VIEW bill_negotiator_leaderboard AS
WITH best_scores AS (
  SELECT DISTINCT ON (COALESCE(email, user_id), username) 
    id,
    user_id,
    email,
    username,
    score_data,
    rating_stars,
    bill_reduction_amount,
    final_bill_amount,
    session_duration,
    created_at
  FROM bill_negotiator_scores
  ORDER BY 
    COALESCE(email, user_id), 
    username, 
    bill_reduction_amount DESC NULLS LAST,
    created_at DESC
)
SELECT 
  *,
  ROW_NUMBER() OVER (ORDER BY bill_reduction_amount DESC NULLS LAST) as rank,
  PERCENT_RANK() OVER (ORDER BY bill_reduction_amount ASC NULLS FIRST) * 100 as percentile
FROM best_scores; 