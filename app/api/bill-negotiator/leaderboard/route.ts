import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'all' // today, week, month, all
    const limit = parseInt(searchParams.get('limit') || '100')
    const userId = searchParams.get('userId') // Optional: to get specific user's rank
    
    // Build query based on timeframe
    let query = supabase
      .from('bill_negotiator_leaderboard')
      .select('*')
      .order('bill_reduction_amount', { ascending: false })
      .limit(limit)
    
    // Add time filter
    const now = new Date()
    switch (timeframe) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        query = query.gte('created_at', today.toISOString())
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        query = query.gte('created_at', weekAgo.toISOString())
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        query = query.gte('created_at', monthAgo.toISOString())
        break
    }
    
    const { data: topScores, error } = await query
    
    if (error) {
      console.error('Error fetching leaderboard:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }
    
    // Get total count for this timeframe
    let countQuery = supabase
      .from('bill_negotiator_scores')
      .select('*', { count: 'exact', head: true })
    
    // Apply same timeframe filter for count
    switch (timeframe) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        countQuery = countQuery.gte('created_at', today.toISOString())
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        countQuery = countQuery.gte('created_at', weekAgo.toISOString())
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        countQuery = countQuery.gte('created_at', monthAgo.toISOString())
        break
    }
    
    const { count } = await countQuery
    
    // If userId provided, get their specific data
    let userRank = null
    if (userId) {
      const { data: userData } = await supabase
        .from('bill_negotiator_leaderboard')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      userRank = userData
    }
    
    // Format the response
    const formattedScores = topScores.map((score: any, index: number) => ({
      rank: score.rank || index + 1,
      userId: score.user_id,
      billReduction: score.bill_reduction_amount,
      finalBill: score.final_bill_amount,
      rating: score.rating_stars,
      percentile: Math.round(score.percentile || 0),
      createdAt: score.created_at,
      // Extract key info from score_data for display
      strengths: score.score_data?.strengths || [],
      outcome: score.score_data?.outcome || '',
    }))
    
    return NextResponse.json({
      leaderboard: formattedScores,
      totalParticipants: count || 0,
      timeframe,
      userRank: userRank ? {
        rank: userRank.rank,
        percentile: Math.round(userRank.percentile || 0),
        billReduction: userRank.bill_reduction_amount,
      } : null
    })
  } catch (error) {
    console.error('Error in leaderboard API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 