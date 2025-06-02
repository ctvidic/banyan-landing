import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: any;
  userEmail: string;
  setUserEmail: (email: string) => void;
  username: string;
  setUsername: (username: string) => void;
  wantsLeaderboard: boolean;
  setWantsLeaderboard: (wants: boolean) => void;
  isSubmittingEmail: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}

export function EmailDialog({
  open,
  onOpenChange,
  report,
  userEmail,
  setUserEmail,
  username,
  setUsername,
  wantsLeaderboard,
  setWantsLeaderboard,
  isSubmittingEmail,
  onSubmit
}: EmailDialogProps) {
  const starCount = report?.starCount || 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            🏆 Join Banyan Waitlist & Leaderboard
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Enter your email to join the waitlist and compete on the leaderboard!
          </DialogDescription>
        </DialogHeader>
        
        {/* Show score outside of DialogDescription to avoid hydration error */}
        <div className="text-center mb-4">
          <div className="text-lg font-semibold">
            Your Score: {[...Array(5)].map((_, i) => (
              <span key={i}>{i < starCount ? '⭐' : '☆'}</span>
            ))}
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div>
            <Input
              type="email"
              placeholder="your@email.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className="w-full"
              disabled={isSubmittingEmail}
            />
          </div>
          
          <div>
            <Input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full"
              disabled={isSubmittingEmail}
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1">This will be shown on the leaderboard</p>
          </div>
          
          {/* ALWAYS show checkbox for leaderboard */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="leaderboard-opt-in"
              checked={wantsLeaderboard}
              onCheckedChange={(checked) => setWantsLeaderboard(checked as boolean)}
              disabled={isSubmittingEmail}
            />
            <label 
              htmlFor="leaderboard-opt-in" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add my score to the public leaderboard
            </label>
          </div>
          
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>By submitting, you'll join the Banyan waitlist</p>
            <p className="text-xs italic">You can try multiple times to improve your score!</p>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                // Allow trying again without email
                setTimeout(() => location.reload(), 100);
              }}
              disabled={isSubmittingEmail}
            >
              Skip & Try Again
            </Button>
            <Button
              type="submit"
              disabled={!userEmail || isSubmittingEmail}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmittingEmail ? 'Saving...' : 'Join Waitlist'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 