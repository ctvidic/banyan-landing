import React from 'react';
import { Button } from '@/components/ui/button';
import { STAR_MESSAGES, STAR_PERSONALIZED_MESSAGES } from '../../constants';

interface ReportPhaseProps {
  report: any;
  hasSubmittedEmail: boolean;
  savedScoreData: any;
  onShowEmailDialog: () => void;
  onShowLeaderboard: () => void;
  showInline?: boolean;
}

export function ReportPhase({ 
  report, 
  hasSubmittedEmail, 
  savedScoreData,
  onShowEmailDialog,
  onShowLeaderboard,
  showInline = false
}: ReportPhaseProps) {
  if (!report || report.error) {
    return <p>Loading report...</p>;
  }

  const starCount = report.starCount || 0;
  const totalStars = 5;

  const content = (
    <>
      {/* Large star rating display */}
      {report.rating && (
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">
            {[...Array(totalStars)].map((_, i) => (
              <span 
                key={i} 
                className={`inline-block ${i < starCount ? 'animate-star-appear' : ''}`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {i < starCount ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <p className="text-lg font-semibold text-gray-700 animate-fade-in" style={{ animationDelay: `${starCount * 0.2}s` }}>
            {STAR_MESSAGES[starCount as keyof typeof STAR_MESSAGES] || ""}
          </p>
        </div>
      )}
      
      {/* Join Waitlist/Leaderboard button - prominent at the top */}
      {!hasSubmittedEmail && (
        <div className="text-center mb-6">
          <Button 
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 px-8" 
            onClick={onShowEmailDialog}
          >
            🏆 Join Waitlist & Leaderboard
          </Button>
        </div>
      )}
      
      {/* Quick success message with rank for short attention spans */}
      {savedScoreData && savedScoreData.rank && starCount > 0 && (
        <div className="text-center mb-4 animate-bounce-once">
          <p className="text-2xl">
            {starCount >= 4 ? '🏆' : starCount === 3 ? '🥈' : '💪'} 
            <span className="ml-2 text-lg font-bold text-gray-700">
              You're #{savedScoreData.rank}!
            </span>
          </p>
        </div>
      )}
      
      {/* Effective Rate Summary - show prominently */}
      {(report.dealStructure || report.finalBill) && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Effective Monthly Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                ${report.dealStructure?.effectiveMonthlyRate || report.finalBill}/month
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Monthly Savings</p>
              <p className="text-xl font-semibold text-emerald-600">
                ${report.reduction || (89 - (report.dealStructure?.effectiveMonthlyRate || report.finalBill || 89))}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Percentile display if available */}
      {savedScoreData && savedScoreData.percentile !== null && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-600">
              🎯 You ranked #{savedScoreData.rank || 'N/A'} out of {savedScoreData.totalParticipants} negotiators!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Top {savedScoreData.percentile}% performance
            </p>
            <button
              onClick={onShowLeaderboard}
              className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 underline font-medium"
            >
              View Full Leaderboard →
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4 overflow-y-auto" style={{maxHeight: 400}}>
        {report.outcome && (
            <div>
              <h3 className="font-semibold mb-1">Deal Achieved</h3>
              <p>{report.outcome}</p>
              {report.dealStructure && (
                <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>Effective Monthly Rate:</strong> ${report.dealStructure.effectiveMonthlyRate || report.finalBill}/month
                  </p>
                  {report.dealStructure.details && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Deal Structure:</strong> {report.dealStructure.details}
                    </p>
                  )}
                  {report.dealStructure.contractLength && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Contract:</strong> {report.dealStructure.contractLength} months
                    </p>
                  )}
                </div>
              )}
            </div>
        )}
        {report.strengths && report.strengths.length > 0 && (
          <div>
            <h3 className="font-semibold mb-1">Strengths</h3>
            <ul className="list-disc pl-5">
              {report.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
        {report.improvements && report.improvements.length > 0 && (
          <div>
            <h3 className="font-semibold mb-1">Areas for Improvement</h3>
            <ul className="list-disc pl-5">
              {report.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>
      
      {/* Personalized message - NO BUTTON HERE */}
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
        <p className="text-sm text-gray-700 mb-3">
          {STAR_PERSONALIZED_MESSAGES[starCount as keyof typeof STAR_PERSONALIZED_MESSAGES] || ""}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {starCount === 0 
            ? "Practice makes perfect. Try again and negotiate for a better deal!"
            : "Join Banyan to master money management and negotiation skills."}
        </p>
        
        {/* Button for 0 stars - inside the message box */}
        {starCount === 0 && !hasSubmittedEmail && (
          <Button 
            size="lg"
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 px-8" 
            onClick={() => location.reload()}
          >
            Try Again
          </Button>
        )}
      </div>
      
      {/* Button for 1+ stars - outside the message box */}
      {starCount > 0 && (
        <div className="mt-8 text-center">
          {!hasSubmittedEmail ? (
            <Button 
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 px-8" 
              onClick={onShowEmailDialog}
            >
              Join Waitlist & Try Again
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="lg"
              className="px-8" 
              onClick={() => location.reload()}
            >
              Try Another Negotiation
            </Button>
          )}
        </div>
      )}
    </>
  );

  if (showInline) {
    return content;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Negotiation Report</h1>
      {content}
    </div>
  );
} 