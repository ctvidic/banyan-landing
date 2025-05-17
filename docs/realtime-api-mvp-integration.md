# MVP Steps for OpenAI Realtime API Integration in BillNegotiatorClient

This document outlines the Minimum Viable Product (MVP) steps to integrate the OpenAI Realtime API into the `BillNegotiatorClient.tsx` component, aiming to reduce latency and enable streaming audio for a more natural conversational experience. We will be drawing heavily from the `openai-realtime-agents` example repository.

## Phase 1: Server-Side Setup (Ephemeral Key Generation)

1.  **Create API Route for Ephemeral Key:** -- DONE
    *   Create a new Next.js API route, e.g., `banyan-landing/app/api/session/route.ts`.
    *   This endpoint will be responsible for generating an ephemeral client secret (session token) from OpenAI, which is required to authenticate the client-side Realtime API connection.
    *   It will use the main OpenAI API key on the server-side to request this token. Refer to the latest OpenAI Realtime API documentation for the specific API call to generate this ephemeral key.
    *   The endpoint should return the ephemeral key (client secret) in its JSON response.
    *   **Reference:** Inspired by the need for an `EPHEMERAL_KEY` in `openai-realtime-agents/src/app/App.tsx` and `openai-realtime-agents/src/app/lib/createRealtimeConnection.ts`.

## Phase 2: Client-Side Hook (`useRealtimeNegotiation.ts`)

1.  **Create `useRealtimeNegotiation.ts` Hook:** -- DONE
    *   Create a new custom React hook file: `banyan-landing/app/hooks/useRealtimeNegotiation.ts`.
    *   This hook will encapsulate all client-side logic for Realtime API interaction.

2.  **State Management within the Hook:** -- DONE
    *   Manage internal state: `sessionStatus` (`DISCONNECTED`, `CONNECTING`, `CONNECTED`), `peerConnectionRef`, `dataChannelRef`, `audioElementRef` (for playing agent audio).

3.  **Ephemeral Key Fetching:**
    *   Implement a function within the hook to call the `/api/session` endpoint created in Phase 1 to retrieve the ephemeral key.

4.  **WebRTC Connection (`connect` function):** -- DONE
    *   Adapt the logic from `openai-realtime-agents/src/app/lib/createRealtimeConnection.ts`.
    *   This function will:
        *   Take the fetched ephemeral key.
        *   Create `RTCPeerConnection`.
        *   Set up `pc.ontrack` to play incoming agent audio via `audioElementRef.current.srcObject`.
        *   Get user microphone access (`navigator.mediaDevices.getUserMedia({ audio: true })`) and add the audio track to the `RTCPeerConnection`.
        *   Create an `RTCDataChannel` (e.g., named "oai-events").
        *   Perform the SDP offer/answer handshake with the OpenAI Realtime API endpoint (`https://api.openai.com/v1/realtime?model=...`), sending the client's SDP offer and receiving the server's SDP answer.
        *   Set local and remote descriptions.
        *   Update `sessionStatus`.
        *   Store `pc` and `dc` in refs.
        *   Attach event listeners to the data channel (`onopen`, `onclose`, `onerror`, `onmessage`).

5.  **Sending Client Events (`sendClientEvent` function):**
    *   Implement a function to send JSON-stringified messages/commands to the server via the `RTCDataChannel`.
    *   Reference: `sendClientEvent` in `openai-realtime-agents/src/app/App.tsx`.

6.  **Handling Server Events (Data Channel `onmessage`):**
    *   Adapt the core logic from `openai-realtime-agents/src/app/hooks/useHandleServerEvent.ts`'s `handleServerEvent` function.
    *   Process incoming messages from the data channel:
        *   `session.created`: Update status.
        *   `conversation.item.created` (for user and initial assistant messages): Update transcript/message list.
        *   `conversation.item.input_audio_transcription.completed`: Update user message with final transcript.
        *   `response.audio_transcript.delta`: Stream assistant transcript updates to the message list.
        *   `output_audio_buffer.started`/`stopped`: Manage an `isAgentSpeaking` state.
        *   `response.done`: Finalize assistant message.
    *   This logic will call callback functions passed from `BillNegotiatorClient.tsx` to update its state (e.g., `setMessages`).

7.  **Agent Configuration (`updateSession` / initial setup):**
    *   Implement a method to send a `session.update` event (as seen in `App.tsx`'s `updateSession`) to configure the agent (e.g., voice, instructions for "Sarah" or "Marco" based on `roleRef.current` from the main component).
    *   This will include specifying modalities (text, audio), transcription model, and potentially turn detection settings.

8.  **Exposed Functions and State:**
    *   The hook should expose:
        *   `connect()`
        *   `disconnect()`
        *   `sessionStatus`
        *   `messages` (derived from its internal transcript, or by calling back to update `BillNegotiatorClient`'s messages)
        *   `isAgentSpeaking`
        *   A function to call when the user starts/stops speaking (to trigger `input_audio_buffer.commit` or similar if not using server-side VAD exclusively). For MVP, we might rely on the Realtime API's default VAD.

9.  **Audio Playback:**
    *   Manage an invisible `<audio>` element (via `audioElementRef`) for playing back the agent's speech.

## Phase 3: `BillNegotiatorClient.tsx` Integration

1.  **Remove Old Audio Logic:**
    *   Delete `MediaRecorder` setup, `audioCtx`, `startRecording`, `manualStop`, `transcribe`, `speak`, `sayAsAgent`.

2.  **Integrate `useRealtimeNegotiation` Hook:**
    *   Instantiate the hook.
    *   Use its `connect` function when the "Start Call" button is pressed (after `phase` changes to "call").
    *   Use its `disconnect` function for the "End Call" button.
    *   Display `sessionStatus`.

3.  **Update Message Handling:**
    *   The `messages` state in `BillNegotiatorClient.tsx` will be primarily driven by updates from the `useRealtimeNegotiation` hook (via callbacks or by consuming state exposed by the hook).

4.  **Agent Logic Adaptation:**
    *   The initial greeting from the agent will be triggered by the `session.update` configuration sent by the hook after connection.
    *   The concept of `stepId` and `SCENARIO` might need to be simplified or re-thought. For MVP, the core back-and-forth conversation will be handled by the Realtime API agent based on its instructions.
    *   Escalation (`roleRef.current` change) will involve sending a new `session.update` with the supervisor's agent configuration.

5.  **UI Updates:**
    *   The microphone button in `renderCall()` will now interact with functions from `useRealtimeNegotiation` if manual start/stop of user audio sending is implemented (e.g., for a push-to-talk PTT mode). For MVP relying on server VAD, this button might just be a visual indicator.
    *   The transcript display will update in real-time based on deltas from the hook.

## MVP Omissions (from `openai-realtime-agents` example):

*   Advanced agent configuration UI (dropdowns for scenarios/agents).
*   Complex client-side tool logic (`toolLogic` in agent configs) beyond basic agent instruction.
*   Client-side guardrail processing (`processGuardrail`).
*   Explicit PTT mode toggle and UI (default to server-side VAD or a simple PTT).
*   Codec selection UI.
*   Event logging pane.
*   Audio download feature.

This MVP focuses on achieving the core low-latency, streaming conversation experience. 