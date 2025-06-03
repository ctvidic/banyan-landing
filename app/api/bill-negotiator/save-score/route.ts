import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to extract bill amounts from outcome text
// Simplified parser: detects either "$X off per month" or "$X credit" and computes reduction/finalBill accordingly
function extractBillAmounts(outcome: string): { reduction: number; finalBill: number } {
  console.log('Extracting bill amounts from outcome:', outcome)
  
  let reduction = 0
  let finalBill = 89 // Default starting bill
  const startingBill = 89
  
  // Pattern A: One-time credit
  const creditPattern = /\$(\d+)\s*(?:one[-\s]?time)?\s*credit/i
  const creditMatch2 = outcome.match(creditPattern)
  if (creditMatch2) {
    const credit = parseInt(creditMatch2[1])
    reduction = Math.round((credit / 12) * 100) / 100 // round to cents
    finalBill = Math.round((startingBill - reduction) * 100) / 100
    console.log(`Detected one-time credit: $${credit}, effective reduction $${reduction}, finalBill $${finalBill}`)
    return { reduction, finalBill }
  }
  
  // Pattern B: Monthly discount
  const monthlyPattern = /\$(\d+)\s*off\s*(?:per\s*month|\/month|monthly)/i
  const monthlyMatch2 = outcome.match(monthlyPattern)
  if (monthlyMatch2) {
    const discount = parseInt(monthlyMatch2[1])
    reduction = discount
    finalBill = startingBill - discount
    console.log(`Detected monthly discount: $${discount}, finalBill $${finalBill}`)
    return { reduction, finalBill }
  }
  
  // Pattern 1: "reduced from $X to $Y" or "from $X to $Y"
  const fromToMatch = outcome.match(/from\s*\$(\d+)\s*to\s*\$(\d+)/i)
  if (fromToMatch) {
    const initial = parseInt(fromToMatch[1])
    finalBill = parseInt(fromToMatch[2])
    reduction = initial - finalBill
    console.log(`Matched from/to pattern: $${initial} to $${finalBill}, reduction: $${reduction}`)
    return { reduction, finalBill }
  }
  
  // Pattern 2: "reduced to $X" or "bill reduced to $X"
  const reducedToMatch = outcome.match(/reduced.*?to\s*\$(\d+)/i)
  if (reducedToMatch) {
    finalBill = parseInt(reducedToMatch[1])
    reduction = startingBill - finalBill
    console.log(`Matched reduced to pattern: final bill $${finalBill}, reduction: $${reduction}`)
    return { reduction, finalBill }
  }
  
  // Pattern 3: "$X/month" or "$X per month" (without "reduced" keyword)
  const monthlyMatch = outcome.match(/\$(\d+)(?:\/month|\s*per\s*month)/i)
  if (monthlyMatch && !outcome.toLowerCase().includes('remains') && !outcome.toLowerCase().includes('still')) {
    finalBill = parseInt(monthlyMatch[1])
    reduction = startingBill - finalBill
    console.log(`Matched monthly pattern: $${finalBill}/month, reduction: $${reduction}`)
    return { reduction, finalBill }
  }
  
  // Pattern 4: "back to $X" (e.g., "back to $69")
  const backToMatch = outcome.match(/back\s*to\s*\$(\d+)/i)
  if (backToMatch) {
    finalBill = parseInt(backToMatch[1])
    reduction = startingBill - finalBill
    console.log(`Matched back to pattern: $${finalBill}, reduction: $${reduction}`)
    return { reduction, finalBill }
  }
  
  // Handle "no negotiation" or "remains at $89" cases
  if (outcome.toLowerCase().includes('no negotiation') || 
      outcome.toLowerCase().includes('remains at') ||
      outcome.toLowerCase().includes('still at') ||
      outcome.toLowerCase().includes('bill remains') ||
      outcome.toLowerCase().includes('no reduction')) {
    reduction = 0
    finalBill = startingBill
    console.log('No reduction detected')
    return { reduction, finalBill }
  }
  
  // If no pattern matches, log a warning
  console.warn(`Could not extract bill amounts from outcome: "${outcome}"`)
  return { reduction: 0, finalBill: startingBill }
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
    const { report, sessionDuration, email, username } = body
    
    if (!report) {
      return NextResponse.json({ error: 'Report is required' }, { status: 400 })
    }
    
    // Use the pre-calculated star count from the report, or calculate it if missing
    const ratingStars = report.starCount || (report.rating?.match(/⭐/g) || []).length || 0
    
    // Use AI-provided values directly (simplified scoring should always provide these)
    let reduction: number = typeof report.reduction === 'number' ? report.reduction : 0
    let finalBill: number = typeof report.finalBill === 'number' ? report.finalBill : 89
    
    // Prefer explicit numeric keys if present
    if (report.offerType === "credit" && typeof report.creditAmount === "number") {
      reduction = Math.round((report.creditAmount / 12) * 100) / 100
      finalBill = Math.round((89 - reduction) * 100) / 100
    } else if (report.offerType === "monthlyDiscount" && typeof report.discountPerMonth === "number") {
      reduction = report.discountPerMonth
      finalBill = 89 - reduction
    }
    
    // Only fall back to parsing if AI didn't provide values
    if (typeof reduction !== 'number' || typeof finalBill !== 'number') {
      console.log('AI did not provide bill amounts, falling back to parsing')
      const extracted = extractBillAmounts(report.outcome || '')
      reduction = extracted.reduction
      finalBill = extracted.finalBill
    } else {
      console.log(`Using AI-provided values: finalBill=$${finalBill}, reduction=$${reduction}`)
    }
    
    // Fallback safeguard
    if (typeof reduction !== 'number' || typeof finalBill !== 'number') {
      reduction = 0
      finalBill = 89
    }
    
    // Cross-check with parser to catch AI mistakes
    const parsed = extractBillAmounts(report.outcome || '')
    if (Math.abs(parsed.finalBill - finalBill) > 1) {
      console.warn('AI values inconsistent with parser, overriding with parsed values')
      finalBill = parsed.finalBill
      reduction = parsed.reduction
    }
    
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
        username: username || null,
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