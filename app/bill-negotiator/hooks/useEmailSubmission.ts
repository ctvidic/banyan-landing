import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EmailSubmissionOptions {
  report: any;
  sessionStartTime: number | null;
}

export function useEmailSubmission(report: any, sessionStartTime: number | null) {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
  const [wantsLeaderboard, setWantsLeaderboard] = useState(true);
  const [savedScoreData, setSavedScoreData] = useState<{
    scoreId: string;
    userId: string;
    rank: number | null;
    percentile: number | null;
    totalParticipants: number;
  } | null>(null);
  
  const { toast } = useToast();

  const saveScoreToBackend = useCallback(async (scoreReport: any, email?: string, usernameParam?: string) => {
    if (!sessionStartTime) return null;
    
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    
    try {
      const response = await fetch('/api/bill-negotiator/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report: scoreReport,
          sessionDuration,
          email: email || userEmail,
          username: usernameParam || null
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedScoreData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error saving score:', error);
      return null;
    }
  }, [sessionStartTime, userEmail]);

  const handleEmailSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userEmail || !report) return;
    
    setIsSubmittingEmail(true);
    
    try {
      // Submit to waitlist
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      await fetch(`${supabaseUrl}/functions/v1/waitlist-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'apikey': supabaseAnonKey || '',
        },
        body: JSON.stringify({ 
          email: userEmail.toLowerCase().trim(),
          source: 'bill-negotiator'
        }),
      });
      
      // Save score if user wants leaderboard
      if (wantsLeaderboard) {
        const scoreData = await saveScoreToBackend(report, userEmail, username);
        
        if (scoreData) {
          setHasSubmittedEmail(true);
          setShowEmailDialog(false);
          
          toast({
            title: "🎉 You're on the leaderboard!",
            description: `Ranked #${scoreData.rank} out of ${scoreData.totalParticipants} negotiators`,
            duration: 5000,
          });
        }
      } else {
        setHasSubmittedEmail(true);
        setShowEmailDialog(false);
        
        toast({
          title: "✅ You're on the waitlist!",
          description: "We'll notify you when Banyan launches",
          duration: 5000,
        });
        
        setTimeout(() => location.reload(), 2000);
      }
    } catch (error) {
      console.error('Email submission error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  }, [userEmail, username, report, wantsLeaderboard, saveScoreToBackend, toast]);

  return {
    showEmailDialog,
    setShowEmailDialog,
    userEmail,
    setUserEmail,
    username,
    setUsername,
    wantsLeaderboard,
    setWantsLeaderboard,
    isSubmittingEmail,
    hasSubmittedEmail,
    savedScoreData,
    handleEmailSubmit
  };
} 