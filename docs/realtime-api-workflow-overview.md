# OpenAI Realtime API Integration: Workflow Overview

This document provides a high-level overview of how the `BillNegotiatorClient` component will function after integrating the OpenAI Realtime API. The primary goal of this integration is to significantly reduce latency and enable a more natural, streaming conversational experience for the user.

## Core Architectural Shift

The current system relies on separate, sequential API calls for:
1.  Speech-to-Text (STT) after the user finishes speaking.
2.  Sending the transcribed text to a chat API for a response.
3.  Text-to-Speech (TTS) for the agent's reply.

The new architecture shifts to a **persistent, bidirectional WebRTC (Web Real-Time Communication) connection** with the OpenAI Realtime API. This allows for simultaneous audio streaming and data exchange, forming the foundation for a truly real-time interaction.

## New Workflow Breakdown

Here's how a typical interaction will flow with the Realtime API:

1.  **Call Initiation:**
    *   The user clicks the "Start Call" button in the `BillNegotiatorClient` interface.

2.  **Secure Connection Setup (Handled by `useRealtimeNegotiation` hook):**
    *   **Ephemeral Key Request:** The client-side `useRealtimeNegotiation` hook makes a request to a new, secure backend API route within our application (e.g., `/api/session`).
    *   **Key Generation (Server-Side):** Our backend API route communicates with OpenAI (using our main OpenAI API key) to generate a short-lived "ephemeral key" or "client secret." This key is specifically for authenticating this Realtime API session.
    *   **WebRTC Handshake:** The client receives the ephemeral key and uses it to initiate a WebRTC connection with the OpenAI Realtime API service. This involves:
        *   The client sending an SDP (Session Description Protocol) "offer" detailing its media capabilities.
        *   OpenAI's Realtime API responding with an SDP "answer."
        *   Once the offer/answer exchange is complete and ICE (Interactive Connectivity Establishment) negotiation succeeds, the WebRTC connection is established.
    *   **Data Channel:** An `RTCDataChannel` is also established over the WebRTC connection. This channel is used for sending and receiving JSON-based control messages, configurations, and text-based transcript deltas.

3.  **Real-time Communication Loop:**
    *   **User Speaks:**
        *   The user's microphone audio is captured by the browser.
        *   Instead of waiting for the user to finish, this audio is streamed in real-time directly to the OpenAI Realtime API via the established WebRTC connection.
    *   **Server-Side Processing (OpenAI Realtime API):**
        *   **Live STT:** The Realtime API performs live Speech-to-Text on the incoming audio stream from the user.
        *   **Agent Interaction:** The transcribed user utterance (or events indicating speech activity) is processed by the configured "agent" (e.g., "Sarah" or "Marco," whose persona and instructions are sent via a `session.update` message over the data channel). This agent logic runs within the Realtime API session.
        *   **Response Generation:** The agent formulates a response.
    *   **Agent Responds (Streaming back to Client):**
        *   **Text Deltas:** The agent's textual response is not sent as a single block. Instead, it's streamed back to the client in small chunks (deltas) over the `RTCDataChannel` as it's being generated.
        *   **Streaming Audio (TTS):** Simultaneously, the agent's voice (generated via Text-to-Speech on OpenAI's side) is streamed back to the client as audio data over the WebRTC audio track.

4.  **Client-Side Rendering & Playback (Handled by `useRealtimeNegotiation` and `BillNegotiatorClient`):**
    *   **Live Transcript Update:** The `useRealtimeNegotiation` hook receives the text deltas from the data channel. It then updates the `messages` state in `BillNegotiatorClient.tsx`, causing the agent's response to appear on screen incrementally, as if being typed in real-time.
    *   **Instant Audio Playback:** The hook receives the incoming audio stream from the WebRTC connection and immediately plays it through an HTML `<audio>` element, providing low-latency voice output.

5.  **Voice Activity Detection (VAD):**
    *   The OpenAI Realtime API can handle Voice Activity Detection on the server side. This means the client doesn't need to implement complex VAD logic to know when the user has started or stopped speaking. The client can simply stream audio, and the server determines speech segments. (For MVP, we will likely rely on this server-side VAD).

## Key Benefits of the New Approach

*   **Drastically Reduced Latency:** Eliminates the delays associated with separate API calls. Audio and text are streamed.
*   **Natural Conversation Flow:** Incremental transcript updates and immediate audio playback create a much more fluid and interactive experience, mimicking a real phone call.
*   **Simplified Client Logic (for STT/TTS):** The complexities of STT and TTS are largely offloaded to the Realtime API.
*   **Full-Duplex Communication:** User and agent can potentially interrupt each other (though handling interruptions gracefully will be an advanced feature, the underlying capability is there).

## Role of Key Components

*   **`banyan-landing/app/api/session/route.ts` (New Backend API):**
    *   Securely generates the ephemeral session token from OpenAI.
*   **`banyan-landing/app/hooks/useRealtimeNegotiation.ts` (New Client-Side Hook):**
    *   Manages the entire lifecycle of the WebRTC connection (setup, ephemeral key fetching, sending/receiving data and audio).
    *   Processes events from the Realtime API.
    *   Provides a simplified interface (functions and state) for `BillNegotiatorClient.tsx` to interact with the Realtime session.
*   **`banyan-landing/app/components/BillNegotiatorClient.tsx` (Modified):**
    *   Focuses more on UI presentation and overall call state (`phase`).
    *   Uses the `useRealtimeNegotiation` hook to drive the conversational aspects (connecting, disconnecting, displaying messages, triggering agent configuration changes like supervisor escalation).
    *   Its internal audio recording and separate API call logic will be removed.

This new architecture promises a significantly more responsive and engaging bill negotiation simulator. 