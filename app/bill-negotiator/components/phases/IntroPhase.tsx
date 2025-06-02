import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { DEMO_LIMITATIONS } from '../../constants';

interface IntroPhaseProps {
  onStart: () => void;
  hasAcceptedTerms: boolean;
  onShowTermsDialog: () => void;
  showTestPanel?: boolean;
  onTestScenario?: (starCount: number) => void;
}

export function IntroPhase({ 
  onStart, 
  hasAcceptedTerms, 
  onShowTermsDialog,
  showTestPanel = false,
  onTestScenario
}: IntroPhaseProps) {
  const handleStart = () => {
    if (!hasAcceptedTerms) {
      onShowTermsDialog();
    } else {
      onStart();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Bill Negotiator Simulator</h1>
      <p className="text-lg text-gray-600 mb-6">
        Practice your negotiation skills in this interactive simulation. You'll be given
        a scenario and will negotiate with a customer-service representative to resolve your issue.
      </p>
      
      {/* Add warning box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">{DEMO_LIMITATIONS.warningText}</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Maximum {DEMO_LIMITATIONS.maxSessions} practice sessions per hour</li>
              <li>Each call limited to {DEMO_LIMITATIONS.sessionDuration} minutes</li>
              <li>This is an AI simulation for educational purposes only</li>
            </ul>
          </div>
        </div>
      </div>

      <Button 
        size="lg" 
        className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
        onClick={handleStart}>
        Get Started
      </Button>

      {/* Development Testing Panel */}
      {showTestPanel && process.env.NODE_ENV === 'development' && onTestScenario && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">🧪 Development Testing</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTestScenario(5)}
              className="bg-green-100 hover:bg-green-200"
            >
              5⭐ Perfect ($64)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTestScenario(4)}
              className="bg-blue-100 hover:bg-blue-200"
            >
              4⭐ Good ($69)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTestScenario(3)}
              className="bg-yellow-100 hover:bg-yellow-200"
            >
              3⭐ Okay ($84)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTestScenario(2)}
              className="bg-orange-100 hover:bg-orange-200"
            >
              2⭐ Poor (credit)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTestScenario(1)}
              className="bg-red-100 hover:bg-red-200"
            >
              1⭐ Failed ($89)
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onTestScenario(3)}
              className="bg-purple-100 hover:bg-purple-200"
            >
              3⭐ Decent ($74)
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Test different negotiation outcomes and confetti triggers</p>
        </div>
      )}
    </div>
  );
} 