"use client"

import React, { useState, useEffect } from "react"
import { Trophy, Medal, Award, Clock, DollarSign, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type LeaderboardEntry = {
  id: string;
  name: string;
  totalReduction: number;
  timeInSeconds: number;
  timestamp: string;
  rank: number;
};

type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
  count: number;
};

const getTrophyIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500 animate-trophy-glow" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400 animate-medal-shine" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600 animate-bronze-shine" />;
    default:
      return <span className="h-6 w-6 flex items-center justify-center text-sm font-bold text-gray-600 animate-rank-bounce">{rank}</span>;
  }
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

const getTrophyBackgroundClass = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
    case 2:
      return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
    case 3:
      return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
    default:
      return "bg-white border-gray-100";
  }
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data: LeaderboardResponse = await response.json();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading leaderboard: {error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🏆 Negotiation Leaderboard</h2>
        <p className="text-gray-600">See how you rank against other negotiators. Higher total reductions and faster times are better!</p>
        <p className="text-sm text-gray-500 mt-1">Maximum possible: $240 total (12 months × $20/month)</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-bounce-slow" />
          <p className="text-gray-600 text-lg">No entries yet!</p>
          <p className="text-gray-500">Be the first to complete a negotiation and claim the top spot.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-lg font-semibold text-emerald-800 text-sm">
            <div className="col-span-2">Rank</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Total 12-Month Reduction</div>
            <div className="col-span-3">Time</div>
          </div>

          {/* Leaderboard entries */}
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.id}
              className={`rounded-lg border-2 transition-all duration-200 hover:shadow-md leaderboard-entry-hover animate-leaderboard-entry-appear ${getTrophyBackgroundClass(entry.rank)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Desktop view */}
              <div className="hidden sm:grid grid-cols-12 gap-4 items-center px-6 py-4">
                <div className="col-span-2 flex items-center gap-3">
                  {getTrophyIcon(entry.rank)}
                  <span className="font-bold text-lg">#{entry.rank}</span>
                </div>
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{entry.name}</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-700">${entry.totalReduction}</span>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700">{formatTime(entry.timeInSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Mobile view */}
              <div className="sm:hidden px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTrophyIcon(entry.rank)}
                    <span className="font-bold text-lg">#{entry.rank}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{entry.name}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-700">${entry.totalReduction}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700">{formatTime(entry.timeInSeconds)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer stats */}
      {leaderboard.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{leaderboard.length}</span> negotiators have competed so far
          </p>
          {leaderboard.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Best total reduction: <span className="font-semibold text-green-600">${leaderboard[0]?.totalReduction}</span> • 
              Fastest time: <span className="font-semibold text-blue-600">{formatTime(Math.min(...leaderboard.map(e => e.timeInSeconds)))}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
} 