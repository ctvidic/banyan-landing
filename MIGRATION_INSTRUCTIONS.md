# Bill Negotiator Database Migration

The bill negotiator feature requires database tables that need to be created in your Supabase instance.

## Error: relation "public.bill_negotiator_leaderboard" does not exist

If you're seeing this error, you need to run the migration to create the required tables and views.

## How to Run the Migration

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire SQL script from `supabase/migrations/20240602_bill_negotiator_scores.sql`
4. Click "Run" to execute the migration

## What the Migration Creates

- `bill_negotiator_scores` table - Stores negotiation results with optional email
- `bill_negotiator_leaderboard` view - Provides ranked leaderboard with percentiles
- Indexes for performance (including email index)
- Row Level Security (RLS) policies for anonymous access

## Note on Email Collection

The table includes an optional `email` field. Email is only collected if users want to join the leaderboard after completing a negotiation. This helps with user acquisition while keeping the initial experience friction-free.

## Verify Migration Success

After running the migration, you can verify it worked by running this query:

```sql
SELECT * FROM bill_negotiator_leaderboard LIMIT 1;
```

This should return an empty result set (not an error) if the migration was successful. 