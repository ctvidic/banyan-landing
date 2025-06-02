# Bill Negotiator Feature

A gamified negotiation training tool that helps users practice their bill negotiation skills with AI-powered customer service representatives.

## Features

- **Interactive Voice Calls**: Real-time conversation with AI agents
- **Progressive Difficulty**: Start with frontline reps, escalate to supervisors
- **Skill Assessment**: AI-powered scoring and feedback
- **Global Leaderboard**: Compare your negotiation skills with others
- **Percentile Rankings**: See where you stand among all participants

## Backend Storage

### Database Schema (Supabase)

```sql
-- Table: bill_negotiator_scores
- id: UUID (primary key)
- user_id: Anonymous identifier
- score_data: Full negotiation report (JSONB)
- rating_stars: 1-5 star rating
- bill_reduction_amount: Amount saved ($)
- final_bill_amount: Final negotiated bill
- session_duration: Call length in seconds
- created_at: Timestamp

-- View: bill_negotiator_leaderboard
- Includes all score fields plus:
- rank: Global ranking by bill reduction
- percentile: Percentile ranking (0-100)
```

### API Endpoints

#### POST `/api/bill-negotiator/save-score`
Saves a negotiation score to the database.

**Request Body:**
```json
{
  "report": {
    "strengths": ["array of strengths"],
    "improvements": ["array of improvements"],
    "outcome": "Negotiation outcome text",
    "rating": "⭐⭐⭐⭐☆",
    "confettiWorthy": true
  },
  "sessionDuration": 180
}
```

**Response:**
```json
{
  "success": true,
  "scoreId": "uuid",
  "userId": "anonymous-id",
  "rank": 42,
  "percentile": 85,
  "totalParticipants": 1247
}
```

#### GET `/api/bill-negotiator/leaderboard`
Fetches leaderboard data with optional filters.

**Query Parameters:**
- `timeframe`: "today" | "week" | "month" | "all" (default: "all")
- `limit`: Number of results (default: 100)
- `userId`: Get specific user's rank

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "anonymous-id",
      "billReduction": 25,
      "finalBill": 64,
      "rating": 5,
      "percentile": 100,
      "createdAt": "2024-01-01T00:00:00Z",
      "outcome": "Perfect negotiation!"
    }
  ],
  "totalParticipants": 1247,
  "timeframe": "all",
  "userRank": {
    "rank": 42,
    "percentile": 85,
    "billReduction": 20
  }
}
```

## Privacy & Security

- **Anonymous Users**: No personal data required or stored
- **Session-based IDs**: Generated from browser fingerprint
- **No PII**: Only negotiation performance data is stored
- **RLS Policies**: Row-level security ensures data integrity

## Scaling Considerations

The system is designed to handle thousands of users:
- Database indexes on `bill_reduction_amount` and `created_at`
- Percentile calculations use PostgreSQL window functions
- Leaderboard view pre-calculates rankings
- API responses are paginated and cached

## Future Enhancements

1. **User Accounts**: Optional registration for persistent progress
2. **Achievements**: Unlock badges for specific negotiation tactics
3. **Scenario Variety**: Different bill types (cable, phone, utilities)
4. **Multiplayer Mode**: Compete head-to-head in real-time
5. **Analytics Dashboard**: Detailed performance insights 