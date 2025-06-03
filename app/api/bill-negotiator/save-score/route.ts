import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { validateApiRequest, saveScoreSchema, sanitizeString, isValidEmail } from '@/lib/security'

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
  
  // Sanitize outcome text first
  const sanitizedOutcome = sanitizeString(outcome)
  
  // Pattern A: One-time credit
  const creditPattern = /\$(\d+)\s*(?:one[-\s]?time)?\s*credit/i
  const creditMatch2 = sanitizedOutcome.match(creditPattern)
  if (creditMatch2) {
    const credit = parseInt(creditMatch2[1])
    // Validate reasonable credit amounts
    if (credit >= 0 && credit <= 1000) {
      reduction = Math.round((credit / 12) * 100) / 100 // round to cents
      finalBill = Math.round((startingBill - reduction) * 100) / 100
      console.log(`Detected one-time credit: $${credit}, effective reduction $${reduction}, finalBill $${finalBill}`)
      return { reduction, finalBill }
    }
  }
  
  // Pattern B: Monthly discount
  const monthlyPattern = /\$(\d+)\s*off\s*(?:per\s*month|\/month|monthly)/i
  const monthlyMatch2 = sanitizedOutcome.match(monthlyPattern)
  if (monthlyMatch2) {
    const discount = parseInt(monthlyMatch2[1])
    // Validate reasonable discount amounts
    if (discount >= 0 && discount <= 100) {
      reduction = discount
      finalBill = startingBill - discount
      console.log(`Detected monthly discount: $${discount}, finalBill $${finalBill}`)
      return { reduction, finalBill }
    }
  }
  
  // Pattern 1: "reduced from $X to $Y" or "from $X to $Y"
  const fromToMatch = sanitizedOutcome.match(/from\s*\$(\d+)\s*to\s*\$(\d+)/i)
  if (fromToMatch) {
    const fromAmount = parseInt(fromToMatch[1])
    const toAmount = parseInt(fromToMatch[2])
    // Validate amounts are reasonable
    if (fromAmount >= 0 && fromAmount <= 200 && toAmount >= 0 && toAmount <= 200) {
      finalBill = toAmount
      reduction = fromAmount - toAmount
      console.log(`Detected from/to pattern: from $${fromAmount} to $${toAmount}, reduction: $${reduction}`)
      return { reduction: Math.max(0, reduction), finalBill }
    }
  }
  
  // Pattern 2: "bill is now $X" or "new bill: $X"
  const newBillMatch = sanitizedOutcome.match(/(?:bill is now|new bill:?)\s*\$(\d+)/i)
  if (newBillMatch) {
    const newBill = parseInt(newBillMatch[1])
    // Validate amount is reasonable
    if (newBill >= 0 && newBill <= 200) {
      finalBill = newBill
      reduction = startingBill - newBill
      console.log(`Detected new bill pattern: $${newBill}, reduction: $${reduction}`)
      return { reduction: Math.max(0, reduction), finalBill }
    }
  }
  
  // Pattern 3: "saved $X" or "saving $X"
  const savedMatch = sanitizedOutcome.match(/sav(?:ed|ing)\s*\$(\d+)/i)
  if (savedMatch) {
    const saved = parseInt(savedMatch[1])
    // Validate amount is reasonable
    if (saved >= 0 && saved <= 100) {
      reduction = saved
      finalBill = startingBill - saved
      console.log(`Detected savings pattern: saved $${saved}, finalBill: $${finalBill}`)
      return { reduction, finalBill }
    }
  }
  
  console.log('No patterns matched, using defaults')
  return { reduction: 0, finalBill: 89 }
}

// Generate anonymous user ID using fingerprinting with enhanced security
function generateAnonymousUserId(request: NextRequest): string {
  const headers = request.headers
  const userAgent = headers.get('user-agent') || 'unknown'
  const acceptLanguage = headers.get('accept-language') || 'unknown'
  const acceptEncoding = headers.get('accept-encoding') || 'unknown'
  
  // Create a more robust fingerprint
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)); // Hour-based to allow some consistency
  const fingerprint = `${userAgent.slice(0, 100)}-${acceptLanguage}-${acceptEncoding}-${timestamp}`
  
  // Simple hash that's consistent but not easily reverse-engineered
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36).substring(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    // Validate API request origin
    if (!validateApiRequest(request)) {
      console.warn('Unauthorized save-score request:', {
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent')?.slice(0, 100)
      });
      return NextResponse.json(
        { error: 'Unauthorized request' },
        { status: 401 }
      );
    }

    const body = await request.json()
    
    // Validate input with comprehensive schema
    const validationResult = saveScoreSchema.safeParse(body);
    if (!validationResult.success) {
      console.warn('Invalid save-score request:', validationResult.error.issues);
      return NextResponse.json(
        { error: 'Invalid request format', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { report, sessionDuration, email, username } = validationResult.data;

    // Additional email validation if provided
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize text fields
    const sanitizedReport = {
      ...report,
      outcome: report.outcome ? sanitizeString(report.outcome) : '',
      strengths: report.strengths?.map(s => sanitizeString(s)) || [],
      improvements: report.improvements?.map(s => sanitizeString(s)) || [],
    };

    // Use the pre-calculated star count from the report, or calculate it if missing
    const ratingStars = sanitizedReport.starCount || (sanitizedReport.rating?.match(/⭐/g) || []).length || 0
    
    // Validate star count is reasonable
    if (ratingStars < 0 || ratingStars > 5) {
      return NextResponse.json(
        { error: 'Invalid star rating' },
        { status: 400 }
      );
    }

    // Use AI-provided values directly (simplified scoring should always provide these)
    let reduction: number = typeof sanitizedReport.reduction === 'number' ? sanitizedReport.reduction : 0
    let finalBill: number = typeof sanitizedReport.finalBill === 'number' ? sanitizedReport.finalBill : 89
    
    // Validate AI-provided values are reasonable
    if (reduction < 0 || reduction > 100) reduction = 0;
    if (finalBill < 0 || finalBill > 200) finalBill = 89;

    // Prefer explicit numeric keys if present
    if (sanitizedReport.offerType === "credit" && typeof sanitizedReport.creditAmount === "number") {
      const creditAmount = Math.min(Math.max(0, sanitizedReport.creditAmount), 1000); // Clamp to reasonable range
      reduction = Math.round((creditAmount / 12) * 100) / 100
      finalBill = Math.round((89 - reduction) * 100) / 100
    } else if (sanitizedReport.offerType === "monthlyDiscount" && typeof sanitizedReport.discountPerMonth === "number") {
      const discount = Math.min(Math.max(0, sanitizedReport.discountPerMonth), 100); // Clamp to reasonable range
      reduction = discount
      finalBill = 89 - reduction
    }
    
    // Only fall back to parsing if AI didn't provide values
    if (typeof reduction !== 'number' || typeof finalBill !== 'number') {
      console.log('AI did not provide bill amounts, falling back to parsing')
      const extracted = extractBillAmounts(sanitizedReport.outcome || '')
      reduction = extracted.reduction
      finalBill = extracted.finalBill
    } else {
      console.log(`Using AI-provided values: finalBill=$${finalBill}, reduction=$${reduction}`)
    }
    
    // Fallback safeguard with validation
    if (typeof reduction !== 'number' || reduction < 0 || reduction > 100) {
      reduction = 0
    }
    if (typeof finalBill !== 'number' || finalBill < 0 || finalBill > 200) {
      finalBill = 89
    }
    
    // Cross-check with parser to catch AI mistakes
    const parsed = extractBillAmounts(sanitizedReport.outcome || '')
    if (Math.abs(parsed.finalBill - finalBill) > 1) {
      console.warn('AI values inconsistent with parser, overriding with parsed values')
      finalBill = parsed.finalBill
      reduction = parsed.reduction
    }
    
    // Handle 0 stars (no negotiation) - DB requires minimum 1
    const starsToSave = Math.max(1, ratingStars)
    
    // Generate anonymous user ID
    const userId = generateAnonymousUserId(request)
    
    // Prepare sanitized data for database
    const dbData = {
      user_id: userId,
      email: email ? email.toLowerCase().trim() : null,
      username: username ? sanitizeString(username).slice(0, 50) : null,
      score_data: sanitizedReport,
      rating_stars: starsToSave,
      bill_reduction_amount: reduction,
      final_bill_amount: finalBill,
      session_duration: sessionDuration || null
    };

    // Save the score with error handling
    const { data, error } = await supabase
      .from('bill_negotiator_scores')
      .insert(dbData)
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
    
    // Don't expose internal error details
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 