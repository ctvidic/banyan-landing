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
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-semibold text-gray-600">#{rank}</span>
    }
  }

  const formatUsername = (entry: LeaderboardEntry, currentUserId?: string) => {
    if (entry.userId === currentUserId) return 'You'
    
    if (entry.email) {
      // Show first letter and domain
      const [name, domain] = entry.email.split('@')
      return `${name[0].toUpperCase()}***@${domain.split('.')[0]}`
    }
    
    return `User ${entry.userId.substring(0, 6)}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Medal className="h-6 w-6 text-emerald-600" />
          Negotiation Leaderboard
        </CardTitle>
        <CardDescription>
          See how your negotiation skills compare to others
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={timeframe} className="space-y-4">
            {/* User's current rank */}
            {data?.userRank && currentUserId && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-emerald-600">
                      #{data.userRank.rank}
                    </div>
                    <div>
                      <p className="font-semibold">Your Rank</p>
                      <p className="text-sm text-gray-600">
                        Top {data.userRank.percentile}% • Saved {formatCurrency(data.userRank.billReduction)}
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            )}

            {/* Total participants */}
            <div className="flex items-center gap-2 text-sm text-gray-600 pb-2">
              <Users className="h-4 w-4" />
              <span>{data?.totalParticipants || 0} total negotiations</span>
            </div>

            {/* Leaderboard entries */}
            <div className="space-y-2">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : data?.leaderboard.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No negotiations yet for this timeframe
                </div>
              ) : (
                data?.leaderboard.map((entry) => (
                  <div
                    key={`${entry.userId}-${entry.createdAt}`}
                    className={`flex items-center gap-4 p-3 rounded-lg border ${
                      entry.userId === currentUserId
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <div className="flex-shrink-0 w-12 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatUsername(entry, currentUserId)}
                        </span>
                        <span className="text-sm">{getRatingStars(entry.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {entry.outcome || `Saved ${formatCurrency(entry.billReduction)}`}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-emerald-600">
                        {formatCurrency(entry.billReduction)}
                      </div>
                      <div className="text-xs text-gray-500">
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