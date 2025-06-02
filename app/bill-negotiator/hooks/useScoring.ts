import { useState, useCallback } from 'react';
import { SCORING_PROMPT } from '../constants';

interface ScoreReport {
  strengths?: string[];
  improvements?: string[];
  outcome?: string;
  rating?: string;
  confettiWorthy?: boolean;
  finalBill?: number;
  reduction?: number;
  starCount?: number;
  error?: string;
  details?: string;
  text?: string;
}

export function useScoring() {
  const [report, setReport] = useState<ScoreReport | null>(null);

  const score = useCallback(async (transcript: string) => {
    console.log("BN_CLIENT: score() called. Transcript provided:", transcript);
    
    try {
      const r = await fetch("/api/openai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: SCORING_PROMPT + `\n\n${transcript}`
        })
      });
      
      console.log("BN_CLIENT: Score API response status:", r.status, "OK?:", r.ok);

      if (!r.ok) {
        const errorText = await r.text();
        console.error("BN_CLIENT: Score API request failed.", r.status, errorText);
        setReport({ error: `API request failed with status ${r.status}`, details: errorText });
        return;
      }

      const j = await r.json(); 
      console.log("BN_CLIENT: Score API response JSON:", JSON.stringify(j, null, 2));
      
      // Parse the report ONCE here if needed
      let finalReport = j;
      if (j.text && typeof j.text === "string") {
        console.log("BN_CLIENT: Report has text property, parsing it ONCE");
        try {
          const cleanedText = j.text.replace(/```json\s*|\s*```/g, "").trim();
          finalReport = JSON.parse(cleanedText);
          // Add star count to the report object
          finalReport.starCount = (finalReport.rating?.match(/⭐/g) || []).length;
          console.log("BN_CLIENT: Parsed report with star count:", finalReport.starCount);
        } catch (e) {
          console.error("BN_CLIENT: Failed to parse report:", e);
          finalReport = { error: "Failed to parse report", details: String(e) };
        }
      } else if (j.rating) {
        // Already parsed, just add star count
        finalReport.starCount = (j.rating?.match(/⭐/g) || []).length;
        console.log("BN_CLIENT: Direct report with star count:", finalReport.starCount);
      }
      
      setReport(finalReport);
      return finalReport;
    } catch (error) {
      console.error("BN_CLIENT: Error in score function (fetching or parsing JSON):", error);
      setReport({ error: "Failed to fetch or parse score data.", details: String(error) });
    }
  }, []);

  return { report, score, setReport };
} 