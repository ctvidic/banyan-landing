'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, TrendingUp, Medal, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface LeaderboardEntry {
  rank: number
  userId: string
  email?: string
  username?: string
  billReduction: number
  finalBill: number
  rating: number
  percentile: number
  createdAt: string
  outcome: string
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  totalParticipants: number
  timeframe: string
  userRank?: {
    rank: number
    percentile: number
    billReduction: number
  }
}

export default function BillNegotiatorLeaderboard({ currentUserId }: { currentUserId?: string }) {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('all')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          timeframe,
          limit: '50',
          ...(currentUserId && { userId: currentUserId })
        })
        
        const response = await fetch(`/api/bill-negotiator/leaderboard?${params}`)
        const result = await response.json()
        
        if (response.ok) {
          setData(result)
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [timeframe, currentUserId])

  const getRatingStars = (rating: number) => {
    if (rating === 0) return '☆☆☆☆☆'
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      case 3:
        return <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
      default:
        return <span className="text-xs sm:text-sm font-semibold text-gray-600">#{rank}</span>
    }
  }

  const formatUsername = (entry: LeaderboardEntry, currentUserId?: string) => {
    // Show username if available
    if (entry.username) {
      return entry.username
    }
    
    // Fallback to masked email if available
    if (entry.email) {
      // Show first letter and domain
      const [name, domain] = entry.email.split('@')
      return `${name[0].toUpperCase()}***@${domain.split('.')[0]}`
    }
    
    // Only show "You" if no email/username and it's the current user
    if (entry.userId === currentUserId) return 'You'
    
    return `User ${entry.userId.substring(0, 6)}`
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
          <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
          <span className="break-words">Negotiation Leaderboard</span>
        </CardTitle>
        <CardDescription className="text-sm">
          See how your negotiation skills compare to others
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 gap-1">
            <TabsTrigger value="today" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="sm:hidden">Today</span>
              <span className="hidden sm:inline">Today</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-3">
              <span className="sm:hidden">All</span>
              <span className="hidden sm:inline">All Time</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={timeframe} className="space-y-4 mt-0">
            {/* User's current rank */}
            {data?.userRank && currentUserId && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                      #{data.userRank.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Your Rank</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Top {data.userRank.percentile}% • Saved {formatCurrency(data.userRank.billReduction)}
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 hidden sm:block" />
                </div>
              </div>
            )}

            {/* Total participants */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 pb-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{data?.totalParticipants || 0} total negotiations</span>
            </div>

            {/* Leaderboard entries */}
            <div className="space-y-2">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 sm:h-16 w-full" />
                ))
              ) : data?.leaderboard.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No negotiations yet for this timeframe
                </div>
              ) : (
                data?.leaderboard.map((entry, index) => (
                  <div
                    key={`${entry.userId}-${entry.createdAt}`}
                    className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg border ${
                      entry.userId === currentUserId
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-8 sm:w-12 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    {/* User info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <span className="font-medium text-sm sm:text-base truncate">
                          {formatUsername(entry, currentUserId)}
                        </span>
                        <span className="text-xs sm:text-sm sm:ml-auto hidden sm:inline">
                          {getRatingStars(entry.rating)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {entry.outcome || `Saved ${formatCurrency(entry.billReduction)}`}
                      </p>
                      {/* Mobile stars */}
                      <span className="text-xs inline sm:hidden mt-1">
                        {getRatingStars(entry.rating)}
                      </span>
                    </div>
                    
                    {/* Savings */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-emerald-600 text-sm sm:text-base">
                        {formatCurrency(entry.billReduction)}
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block">
                        saved
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 