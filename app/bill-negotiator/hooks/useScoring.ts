import { useState, useCallback } from 'react';
import { SCORING_PROMPT } from '../constants';

interface ScoreReport {
  strengths?: string[];
  improvements?: string[];
  outcome?: string;
  rating?: string;
  starCount?: number;
  confettiWorthy?: boolean;
  offerType?: "credit" | "monthlyDiscount" | "none";
  creditAmount?: number;
  discountPerMonth?: number;
  finalBill?: number;
  reduction?: number;
  error?: string;
  details?: string;
  text?: string;
}

export function useScoring() {
  const [report, setReport] = useState<ScoreReport | null>(null);

  const score = useCallback(async (transcript: string) => {
    console.log("BN_CLIENT: score() called. Transcript length:", transcript?.length);
    console.log("BN_CLIENT: First 500 chars of transcript:", transcript?.substring(0, 500));
    
    // Check if transcript is empty or invalid
    if (!transcript || transcript.trim().length === 0) {
      console.error("BN_CLIENT: EMPTY TRANSCRIPT PROVIDED TO SCORE FUNCTION!");
      const emptyReport = {
        error: "No conversation to analyze",
        strengths: [],
        improvements: ["No conversation took place"],
        outcome: "No negotiation attempted - bill remains at $89",
        rating: "☆☆☆☆☆",
        starCount: 0,
        confettiWorthy: false,
        finalBill: 89,
        reduction: 0
      };
      setReport(emptyReport);
      return emptyReport;
    }
    
    try {
      const requestBody = {
        prompt: SCORING_PROMPT + `\n\n${transcript}`
      };
      
      console.log("BN_CLIENT: Sending request to /api/openai/chat");
      console.log("BN_CLIENT: Request body length:", JSON.stringify(requestBody).length);
      console.log("BN_CLIENT: Full prompt being sent (first 1000 chars):", requestBody.prompt.substring(0, 1000));
      
      const r = await fetch("/api/openai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      
      console.log("BN_CLIENT: Score API response status:", r.status, "OK?:", r.ok);
      console.log("BN_CLIENT: Response headers:", Object.fromEntries(r.headers.entries()));

      if (!r.ok) {
        const errorText = await r.text();
        console.error("BN_CLIENT: Score API request failed.", r.status, errorText);
        
        // Provide a fallback report instead of showing error to user
        const fallbackReport = {
          error: "Unable to generate detailed report at this time",
          strengths: ["You attempted to negotiate your bill"],
          improvements: ["Try the negotiation again to get a detailed analysis"],
          outcome: "Report generation temporarily unavailable - your negotiation was recorded",
          rating: "⭐⭐⭐☆☆",
          starCount: 3,
          confettiWorthy: false,
          finalBill: 89,
          reduction: 0,
          details: `API Error: ${r.status} - ${errorText.substring(0, 100)}`
        };
        
        setReport(fallbackReport);
        return fallbackReport;
      }

      const j = await r.json(); 
      console.log("BN_CLIENT: Score API response JSON:", JSON.stringify(j, null, 2));
      
      // Validate that we received expected data structure
      if (!j) {
        console.error("BN_CLIENT: Received null/undefined response from API");
        throw new Error("Empty response from scoring API");
      }
      
      // Parse the report ONCE here if needed
      let finalReport = j;
      if (j.text && typeof j.text === "string") {
        console.log("BN_CLIENT: Report has text property, parsing it ONCE");
        try {
          // More robust cleaning of the response
          let cleanedText = j.text.trim();
          
          // Remove markdown code blocks
          cleanedText = cleanedText.replace(/```json\s*|\s*```/g, "");
          
          // Handle cases where response might have extra text before/after JSON
          const jsonStart = cleanedText.indexOf('{');
          const jsonEnd = cleanedText.lastIndexOf('}');
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
          }
          
          console.log("BN_CLIENT: Attempting to parse cleaned text:", cleanedText.substring(0, 200) + "...");
          
          finalReport = JSON.parse(cleanedText);
          
          // Add star count to the report object
          finalReport.starCount = (finalReport.rating?.match(/⭐/g) || []).length;
          console.log("BN_CLIENT: Parsed report with star count:", finalReport.starCount);
          
        } catch (parseError) {
          console.error("BN_CLIENT: Failed to parse report JSON:", parseError);
          console.error("BN_CLIENT: Raw text that failed to parse:", j.text);
          
          // Create fallback report from the error
          finalReport = {
            error: "Report parsing failed - using fallback",
            strengths: ["You completed a negotiation session"],
            improvements: ["Try again for a detailed analysis"],
            outcome: "Your negotiation was recorded but detailed analysis is temporarily unavailable",
            rating: "⭐⭐☆☆☆",
            starCount: 2,
            confettiWorthy: false,
            finalBill: 89,
            reduction: 0,
            details: `Parse Error: ${String(parseError)} | Raw: ${j.text?.substring(0, 100)}`
          };
        }
      } else if (j.rating) {
        // Already parsed, just add star count
        finalReport.starCount = (j.rating?.match(/⭐/g) || []).length;
        console.log("BN_CLIENT: Direct report with star count:", finalReport.starCount);
      } else {
        // Unexpected response format
        console.warn("BN_CLIENT: Unexpected response format, creating fallback report");
        finalReport = {
          error: "Unexpected response format",
          strengths: ["You participated in a negotiation exercise"],
          improvements: ["Try the negotiation again for proper analysis"],
          outcome: "Unable to analyze this session - please try again",
          rating: "⭐⭐☆☆☆",
          starCount: 2,
          confettiWorthy: false,
          finalBill: 89,
          reduction: 0,
          details: `Unexpected format: ${JSON.stringify(j).substring(0, 100)}`
        };
      }
      
      setReport(finalReport);
      console.log("BN_CLIENT: Final report set:", finalReport);
      return finalReport;
      
    } catch (error) {
      console.error("BN_CLIENT: Score function error:", error);
      
      // Create a user-friendly fallback report
      const errorReport = {
        error: "Scoring system temporarily unavailable",
        strengths: ["You completed a negotiation attempt"],
        improvements: ["Please try again - our system is experiencing temporary issues"],
        outcome: "Session recorded but analysis unavailable due to technical difficulties",
        rating: "⭐⭐☆☆☆",
        starCount: 2,
        confettiWorthy: false,
        finalBill: 89,
        reduction: 0,
        details: String(error)
      };
      
      setReport(errorReport);
      return errorReport;
    }
  }, []);

  return { report, score, setReport };
} 