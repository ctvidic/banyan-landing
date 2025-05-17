# Plan for Agent-Initiated Call Ending

This document outlines the changes required to implement the feature where the agent can end the call, and the UI reflects this state.

**I. `banyan-landing/app/hooks/useRealtimeNegotiation.ts` Modifications:**

1.  **Update `UseRealtimeNegotiationProps` Type:**
    *   Add a new callback prop: `onAgentEndedCall: () => void;`

2.  **Modify Agent Prompts:**
    *   For `"agent_frontline"`: Append to `agentInstructions`: "When the conversation is definitively over and you have provided all necessary information or resolution, end your final message with 'Goodbye!'."
    *   For `"agent_supervisor"`: Append to `agentInstructions`: "When the conversation is definitively over and you have provided all necessary information or resolution, end your final message with 'Goodbye!'."

3.  **Update `handleServerEvent` Function:**
    *   In the `case "response.done":` block:
        *   After processing `responseOutput` to get the `finalAssistantText`.
        *   Add a condition: `if (finalAssistantText && finalAssistantText.trim().endsWith("Goodbye!")) {`.
        *   Inside this condition, call `onAgentEndedCall();`.

**II. `banyan-landing/app/components/BillNegotiatorClient.tsx` Modifications:**

1.  **Add New State Variable:**
    *   `const [isCallEndedByAgent, setIsCallEndedByAgent] = useState<boolean>(false);`

2.  **Implement `handleAgentEndedCall` Callback:**
    ```typescript
    const handleAgentEndedCall = useCallback(() => {
      alert("The agent has ended the call."); // Or a more integrated UI notification
      setIsCallEndedByAgent(true);
      realtimeDisconnect(); // Ensure this is the one from the hook
      setPhase("report");
      score(); // Ensure score is memoized or its dependencies are stable if it's a dependency itself
    }, [realtimeDisconnect, setPhase, score]); // Add any other necessary dependencies like score if it's not stable
    ```

3.  **Pass Callback to Hook:**
    *   When calling `useRealtimeNegotiation`, include `onAgentEndedCall: handleAgentEndedCall`.

4.  **Update "End Call" / "Show my score!" Button:**
    *   Modify the `Button` component in `renderCall()`:
        ```tsx
        <Button
          variant="ghost"
          onClick={isCallEndedByAgent ? () => setPhase("report") : endCall}
        >
          {isCallEndedByAgent ? "Show my score!" : "End Call"}
        </Button>
        ```

5.  **Convert `endCall` to `useCallback`:**
    *   Refactor the existing `endCall` function:
    ```typescript
    const endCall = useCallback(() => {
      console.log("BN_CLIENT: endCall invoked by user action.");
      realtimeDisconnect();
      setPhase("report");
      score();
    }, [realtimeDisconnect, setPhase, score]); // Make sure to include dependencies. `score` might need to be wrapped in useCallback if it's not stable.
    ```

**III. Review Dependencies:**

*   Ensure that `score` function in `BillNegotiatorClient.tsx` is stable or wrapped in `useCallback` if it's passed as a dependency to other `useCallback` hooks (like the new `endCall` and `handleAgentEndedCall`), to prevent unnecessary re-creations of those callbacks.
*   Double-check all dependency arrays for `useEffect` and `useCallback` in both files to ensure correctness after these changes. 