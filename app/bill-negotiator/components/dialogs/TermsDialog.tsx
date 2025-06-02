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

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export function TermsDialog({ open, onOpenChange, onAccept }: TermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Terms of Use</DialogTitle>
        </DialogHeader>
        <div className="text-left space-y-3 pt-4 text-sm text-muted-foreground">
          <p>
            <strong>Educational Demo Only:</strong> This is a free educational tool to practice negotiation skills. 
            The AI agents simulate customer service representatives and their responses are not real.
          </p>
          
          <div>
            <p className="mb-2">
              <strong>Usage Limits:</strong> To ensure fair access for all users:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Maximum 3 sessions per hour per user</li>
              <li>Each session limited to 5 minutes</li>
              <li>Sessions may be terminated if idle for 60 seconds</li>
            </ul>
          </div>
          
          <p>
            <strong>Privacy:</strong> We do not store personal information. Session data may be logged 
            for improving the service. Do not share any real personal or financial information.
          </p>
          
          <p>
            <strong>No Guarantees:</strong> Skills learned here may not directly translate to real-world 
            negotiations. Results will vary based on actual service providers and their policies.
          </p>
          
          <p className="text-sm text-gray-600">
            By clicking "I Agree", you acknowledge that you understand and accept these terms.
          </p>
        </div>
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onAccept}
          >
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 