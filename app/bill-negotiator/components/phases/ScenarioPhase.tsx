import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, PhoneOff } from 'lucide-react';
import { SCENARIO_CONFIG } from '../../constants';

interface ScenarioPhaseProps {
  onStart: () => void;
  hasAcceptedTerms: boolean;
  onShowTermsDialog: () => void;
}

export function ScenarioPhase({ onStart, hasAcceptedTerms, onShowTermsDialog }: ScenarioPhaseProps) {
  const handleStart = () => {
    if (!hasAcceptedTerms) {
      onShowTermsDialog();
    } else {
      onStart();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{SCENARIO_CONFIG.title}</h1>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
        <div className="flex items-start mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {SCENARIO_CONFIG.description}
            </p>
            <p className="text-sm text-gray-600 mt-1">{SCENARIO_CONFIG.subtitle}</p>
          </div>
        </div>
        
        <div className="border-t border-emerald-200 pt-4">
          <h3 className="text-lg font-semibold mb-2 text-emerald-800">Your Mission</h3>
          <p className="text-gray-700">
            Call customer service and negotiate your bill back down. Use any tactics: loyalty, competitors, escalation.
          </p>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8 py-6 text-lg"
          onClick={handleStart}>
          <PhoneOff className="mr-2 h-5 w-5" />
          Start Negotiation Call
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          Practice your negotiation skills with AI • 5 min max
        </p>
      </div>
    </div>
  );
} 