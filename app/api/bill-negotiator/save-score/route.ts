import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to extract bill amounts from outcome text
function extractBillAmounts(outcome: string): { reduction: number; finalBill: number } {
  // Look for patterns like "reduced from $89 to $64" or "bill reduced to $70"
  const reducedToMatch = outcome.match(/reduced.*?to\s*\$(\d+)/i)
  const fromToMatch = outcome.match(/from\s*\$(\d+)\s*to\s*\$(\d+)/i)
  
  let reduction = 0
  let finalBill = 89 // Default starting bill
  
  if (fromToMatch) {
    const initial = parseInt(fromToMatch[1])
    finalBill = parseInt(fromToMatch[2])
    reduction = initial - finalBill
  } else if (reducedToMatch) {
    finalBill = parseInt(reducedToMatch[1])
    reduction = 89 - finalBill // Assume starting bill of $89
  }
  
  // Look for credit mentions (e.g., "$10 credit")
  const creditMatch = outcome.match(/\$(\d+)\s*credit/i)
  if (creditMatch && reduction === 0) {
    reduction = parseInt(creditMatch[1])
    finalBill = 89 - reduction
  }
  
  // Handle "no negotiation" or "remains at $89" cases
  if (outcome.toLowerCase().includes('no negotiation') || 
      outcome.toLowerCase().includes('remains at $89') ||
      outcome.toLowerCase().includes('bill remains')) {
    reduction = 0
    finalBill = 89
  }
  
  return { reduction, finalBill }
}

// Generate anonymous user ID using fingerprinting
function generateAnonymousUserId(request: Request): string {
  const headers = request.headers
  const userAgent = headers.get('user-agent') || 'unknown'
  const acceptLanguage = headers.get('accept-language') || 'unknown'
  
  // Create a simple fingerprint (in production, use a proper fingerprinting library)
  const fingerprint = `${userAgent}-${acceptLanguage}-${Date.now()}`
  
  // Hash the fingerprint
  const encoder = new TextEncoder()
  const data = encoder.encode(fingerprint)
  return btoa(String.fromCharCode(...new Uint8Array(data))).substring(0, 16)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { report, sessionDuration, email } = body
    
    if (!report) {
      return NextResponse.json({ error: 'Report is required' }, { status: 400 })
    }
    
    // Extract numeric values from report
    const ratingStars = (report.rating?.match(/⭐/g) || []).length
    const { reduction, finalBill } = extractBillAmounts(report.outcome || '')
    
    // Handle 0 stars (no negotiation) - DB requires minimum 1
    const starsToSave = Math.max(1, ratingStars)
    
    // Generate anonymous user ID
    const userId = generateAnonymousUserId(request)
    
    // Save the score
    const { data, error } = await supabase
      .from('bill_negotiator_scores')
      .insert({
        user_id: userId,
        email: email || null,
        score_data: report,
        rating_stars: starsToSave,
        bill_reduction_amount: reduction,
        final_bill_amount: finalBill,
        session_duration: sessionDuration || null
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving score:', error)
      return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
    }
    
    // Get user's rank and percentile from the view
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('bill_negotiator_leaderboard')
      .select('rank, percentile')
      .eq('id', data.id)
      .single()
    
    if (leaderboardError) {
      console.error('Error fetching leaderboard data:', leaderboardError)
    }
    
    // Get total participants
    const { count } = await supabase
      .from('bill_negotiator_scores')
      .select('*', { count: 'exact', head: true })
    
    return NextResponse.json({
      success: true,
      scoreId: data.id,
      userId: userId,
      rank: leaderboardData?.rank || null,
      percentile: leaderboardData?.percentile ? Math.round(leaderboardData.percentile) : null,
      totalParticipants: count || 0
    })
  } catch (error) {
    console.error('Error in save-score API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 