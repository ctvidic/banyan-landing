# Refactor Plan: AgentConfig and Tool-Based Escalation for Bill Negotiator

**Version:** 1.0
**Date:** 2024-07-29

## 1. Goal

To refactor the Bill Negotiator application to use a more structured, extensible, and maintainable approach for defining agent behaviors and handling escalations, drawing inspiration from the `openai-realtime-agents` example. This involves transitioning from hardcoded agent logic and prompts within the core hook to `AgentConfig`-based definitions and tool-based function calls for actions like agent transfers. The refactored structure should be designed with flexibility in mind, enabling adaptation for other conversational AI scenarios (e.g., different negotiation types, informational agents) beyond the initial bill negotiation context.

## 2. Core Idea

-   Define each agent (Frontline "Sarah", Supervisor "Marco") as a distinct `AgentConfig` object.
-   Embed detailed instructions, personality, and potential tools within these configurations.
-   Replace the current client-side keyword-based escalation with an agent-initiated tool call (e.g., `transferToSupervisor`).
-   Modify `useRealtimeNegotiation.ts` to work with these `AgentConfig` objects and handle tool call events from the OpenAI Realtime API.
-   Simplify `BillNegotiatorClient.tsx` by offloading agent management and escalation logic to the hook and the agents' configured behaviors.

## 3. Phase 1: Agent Definition (`AgentConfig`)

### Tasks:

1.  **Create a New Directory for Agent Configurations:**
    *   Proposed: `banyan-landing/app/banyanAgentConfigs/` (or similar).
2.  **Define `AgentConfig` Types (if not already aligned with `openai-realtime-agents` types):**
    *   Ensure types for `AgentConfig`, `Tool`, `FunctionDefinition`, etc., are available and suitable. This might involve adapting types from the `openai-realtime-agents` example or defining project-specific ones.
3.  **Create `frontlineAgent.ts`:**
    *   Define an `AgentConfig` for "Sarah" (Frontline).
        *   `name`: "agent_frontline" (or a more descriptive unique ID like "sarah_frontline_biller")
        *   `publicDescription`: "Sarah, a friendly frontline customer service representative for billing inquiries."
        *   `instructions`: A detailed prompt defining her persona, goals, key phrases, and specifically, instructions on *when and how* to use the `transferToSupervisor` tool. (Consider using `voiceAgentMetaprompt.txt` from `openai-realtime-agents` as inspiration for the level of detail).
        *   `tools`: Initially empty; will be populated by `injectTransferTools`.
        *   `downstreamAgents`: An array containing a reference to the Supervisor agent's config (e.g., `[supervisorAgentConfig]`).
4.  **Create `supervisorAgent.ts`:**
    *   Define an `AgentConfig` for "Marco" (Supervisor).
        *   `name`: "agent_supervisor" (or "marco_supervisor_biller")
        *   `publicDescription`: "Marco, an authoritative supervisor for escalated billing issues."
        *   `instructions`: Detailed prompt for Marco, including how to acknowledge the transfer and take over the conversation.
        *   `tools`: Empty for now (could include supervisor-specific tools later).
        *   `downstreamAgents`: Empty or could point to other specialized agents if applicable in the future.
5.  **Implement/Adapt `injectTransferTools`:**
    *   Create a utility function (e.g., in `banyan-landing/app/banyanAgentConfigs/utils.ts`) similar to `injectTransferTools` from `openai-realtime-agents`.
    *   This function will:
        *   Take an array of `AgentConfig` objects.
        *   For each agent with `downstreamAgents`, dynamically create and add a `transferToSupervisor` (or a more generic `transferAgent`) tool to its `tools` array.
        *   The tool definition should include:
            *   `name`: e.g., "transferToSupervisor"
            *   `description`: Guiding the LLM on when to use it.
            *   `parameters`: `type: "object"`, with properties like `reason: string` (why the transfer is needed) and `conversation_summary: string` (brief context for the supervisor).
6.  **Export Configured Agents:**
    *   In an `index.ts` within `banyan-landing/app/banyanAgentConfigs/`, import the raw agent configs, process them with `injectTransferTools`, and export the finalized, tool-enriched configurations.

## 4. Phase 2: Modifying `useRealtimeNegotiation.ts`

### Tasks:

1.  **Update Hook Properties:**
    *   Modify `UseRealtimeNegotiationProps` to accept the current `AgentConfig` object (or selected parts like `instructions: string` and `tools: Tool[]`).
    *   The `currentAgentRole: AgentRole` prop might be replaced or supplemented by passing the full `AgentConfig`.
2.  **Adapt `connect` Function:**
    *   When establishing a connection and sending the `session.update` event to the Realtime API:
        *   Use the `instructions` string from the passed `AgentConfig`.
        *   Include the `tools` array from the `AgentConfig` in the `session.update` payload. This informs the Realtime API about the functions the agent can invoke.
        *   The agent's voice and other session parameters can also be derived from the `AgentConfig`.
3.  **Implement Tool Call Handling in `handleServerEvent`:**
    *   Listen for the server event that signifies an agent wants to call a function/tool (e.g., `response.tool_calls`, `function_call_requested` - verify the exact event type from OpenAI Realtime API documentation or examples).
    *   When a `transferToSupervisor` tool call is received:
        *   **Parse Tool Call:** Extract the function name (`transferToSupervisor`) and arguments (e.g., `reason`, `conversation_summary`).
        *   **Log:** Log the intended transfer and the provided arguments.
        *   **Acknowledge (Client-Side UX - Optional):** The client might want to display a message like "Transferring to supervisor..." This could be driven by a new callback from the hook.
        *   **Trigger Disconnect:** Call the internal `disconnect()` function to terminate the current agent session.
        *   **Identify Target Agent:** Based on the tool call (or a fixed logic for `transferToSupervisor`), determine the next `AgentConfig` (i.e., the supervisor's config).
        *   **Trigger Reconnect:** Call the internal `connect()` function, this time passing the supervisor's `AgentConfig`.
        *   **(Crucial) Respond to Tool Call (if required by API):** The OpenAI Realtime API might require a response from the client to acknowledge that the tool call is being handled or has completed. This might involve sending a specific event back via `sendClientEvent` (e.g., `{"type": "tool_result", "tool_call_id": "...", "result": "{ "status": "Transfer initiated to supervisor." }"}`). The `openai-realtime-agents` example should provide a pattern for this.
4.  **New Callback for Client Component (Optional but Recommended):**
    *   Consider adding a new callback to `UseRealtimeNegotiationProps`, e.g., `onAgentTransferring?: (targetAgentName: string, reason?: string) => void;`. This allows `BillNegotiatorClient.tsx` to react to the transfer initiation.
5.  **State Management:**
    *   The hook will internally manage the current `AgentConfig`. The `currentAgentRole` prop (if kept) should be updated based on the active config.

## 5. Phase 3: Modifying `BillNegotiatorClient.tsx`

### Tasks:

1.  **Import Agent Configurations:**
    *   Import the finalized (tool-enriched) `frontlineAgentConfig` and `supervisorAgentConfig` from `banyan-landing/app/banyanAgentConfigs/`.
2.  **Remove Manual Escalation Logic:**
    *   Delete the `agentLogic` function responsible for keyword-spotting ("supervisor", "manager").
    *   Remove associated state variables: `isRoleChangeStaged`, `currentRoleForEffect`, `isEscalationAcknowledgementPending`, and their `useEffect` blocks. The escalation is now driven by the frontline agent's tool call.
3.  **Update Hook Instantiation:**
    *   When calling `useRealtimeNegotiation`, pass the initial `frontlineAgentConfig` (or its relevant parts like `instructions` and `tools`).
    *   The `currentAgentRole` prop passed to the hook will now be derived from the active agent config within the hook, or the client will manage which config to pass on re-connections.
4.  **Handle Agent Transfers (UX):**
    *   If the `onAgentTransferring` callback is implemented in the hook, use it to update UI elements (e.g., display a transfer message).
    *   The visual change of agent (e.g., "Sarah" to "Marco") will occur when the hook reconnects with the new agent's config. The client needs to get the current agent's display name/details, likely from the hook (which knows the active `AgentConfig`).
5.  **Simplify Agent Display:**
    *   The display of the agent's name ("Sarah" or "Marco") and title should be driven by information from the currently active `AgentConfig`, exposed by the `useRealtimeNegotiation` hook.

## 6. Phase 4: Testing and Refinement

### Tasks:

1.  **End-to-End Escalation Test:** Verify that the user can request a supervisor, the frontline agent correctly uses the `transferToSupervisor` tool, and the call is seamlessly transferred to the supervisor agent.
2.  **Context Passing:** Ensure the `reason` and `conversation_summary` from the tool call are available and potentially used by the supervisor agent (e.g., the supervisor's initial prompt could reference this summary).
3.  **Instruction Adherence:** Confirm both agents follow their new, detailed instructions from their respective `AgentConfig`s.
4.  **Error Handling:** Test scenarios where tool calls might fail or the API responds unexpectedly.
5.  **Regression Testing:** Ensure existing functionalities (message display, call start/end, reporting) are not broken.

## 7. Potential Challenges and Considerations

*   **Realtime API Specifics:** The exact event names, payloads, and expected client responses for tool calls need to be double-checked against the latest OpenAI Realtime API documentation.
*   **State Synchronization:** Ensuring the client UI correctly reflects the current agent and call state during and after a transfer.
*   **Conversation Context:** Efficiently and accurately capturing `conversation_summary` for the supervisor. The agent making the tool call should be instructed to generate this summary.
*   **Circular Dependencies:** Be mindful when defining `downstreamAgents` if more complex agent relationships are introduced later. The `injectTransferTools` in the example handles this for stringification by simplifying the `downstreamAgents` reference.
*   **Complexity of Tool Response:** Understanding if a simple "transfer initiated" response is sufficient for the `tool_result`, or if the API expects a more detailed outcome once the new agent is connected.

## 8. Benefits Review

*   **Improved Extensibility:** Easier to add new agents, roles, or tools.
*   **Increased Clarity:** Agent behaviors and capabilities are explicitly defined in their configurations.
*   **Enhanced Agent Autonomy:** Agents make more nuanced decisions based on their instructions, including when to escalate.
*   **Better Maintainability:** Code related to agent logic is modularized.
*   **Alignment with Modern LLM Practices:** Follows patterns for tool usage common in advanced LLM applications.

This refactor represents a significant step towards a more robust and scalable Bill Negotiator application. 