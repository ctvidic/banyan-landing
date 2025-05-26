"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { AgentConfig, Tool } from "../banyanAgentConfigs/types";

// Types (can be expanded later)
export type SessionStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED"
  | "ERROR";

// Re-using Message type from BillNegotiatorClient.tsx - ensure it's available or redefine/import
export type Message = { id: string; role: string; text: string };

interface UseRealtimeNegotiationProps {
  onMessagesUpdate: (messages: Message[]) => void;
  onAgentSpeakingChange: (isSpeaking: boolean) => void;
  onSessionStatusChange: (status: SessionStatus) => void;
  currentAgentConfig: AgentConfig;
  onUserTranscriptCompleted: (transcript: string) => void;
  onAgentEndedCall: () => void;
  onAgentTransferRequested?: (targetAgentName: string, transferArgs: { reason?: string; conversation_summary?: string }) => void;
  onUserSpeakingChange?: (isSpeaking: boolean) => void;
}

export function useRealtimeNegotiation({
  onMessagesUpdate,
  onAgentSpeakingChange,
  onSessionStatusChange,
  currentAgentConfig,
  onUserTranscriptCompleted,
  onAgentEndedCall,
  onAgentTransferRequested,
  onUserSpeakingChange,
}: UseRealtimeNegotiationProps) {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");
  const [internalMessages, setInternalMessages] = useState<Message[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
  const [isTransferInProgress, setIsTransferInProgress] = useState<boolean>(false);
  const [userAudioStream, setUserAudioStream] = useState<MediaStream | null>(null);
  const [agentAudioStream, setAgentAudioStream] = useState<MediaStream | null>(null);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const ephemeralKeyRef = useRef<string | null>(null);
  const assistantMessageDeltasRef = useRef<{ [itemId: string]: string }>({}); // To accumulate deltas
  const agentInitiatedCallEndRef = useRef<boolean>(false); // Renamed from agentHasSaidGoodbyeRef
  const pendingTransferDetailsRef = useRef<{ toolCallId: string; targetAgentName: string; transferArgs: { reason?: string; conversation_summary?: string } } | null>(null);
  const pendingEndCallDetailsRef = useRef<{ toolCallId: string; reason: string } | null>(null);
  const expectingAudioStopForTransferRef = useRef<boolean>(false);

  // Guardrail Refs
  const callDurationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageCountRef = useRef<number>(0);
  const soundEffectAudioElementRef = useRef<HTMLAudioElement | null>(null); // Renamed from warningAudioElementRef
  const finalDisconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageLimitWarningPlayedRef = useRef<boolean>(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleWarningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());
  const isIntentionalDisconnectRef = useRef<boolean>(false);

  // Constants for guardrails and sound effects
  const MAX_CALL_DURATION_MS = 5 * 60 * 1000; // 5 minutes (reduced from 10)
  const MAX_MESSAGES = 50; // Max 50 messages (reduced from 100)
  const WARNING_AUDIO_SRC = "/audio/warning.mp3"; 
  const DISCONNECT_AUDIO_SRC = "/audio/disconnect.mp3"; // For agent-initiated disconnect
  const CALL_DURATION_WARNING_PERIOD_MS = 30 * 1000; // 30 seconds warning
  const MESSAGE_WARNING_THRESHOLD_FACTOR = 0.9; // Warn at 90% of max messages
  const IDLE_TIMEOUT_MS = 60 * 1000; // 60 seconds of no activity
  const IDLE_WARNING_MS = 45 * 1000; // Warn after 45 seconds of inactivity

  // const agentNameMap: Record<AgentRole, "Sarah" | "Marco"> = {
  //   agent_frontline: "Sarah",
  //   agent_supervisor: "Marco",
  // };

  // Effect to propagate internal state changes to the parent component
  useEffect(() => {
    onMessagesUpdate(internalMessages);
  }, [internalMessages, onMessagesUpdate]);

  useEffect(() => {
    onAgentSpeakingChange(isAgentSpeaking);
  }, [isAgentSpeaking, onAgentSpeakingChange]);

  useEffect(() => {
    onSessionStatusChange(sessionStatus);
  }, [sessionStatus, onSessionStatusChange]);

  // Effect to create warning audio element
  useEffect(() => {
    if (!soundEffectAudioElementRef.current) {
      soundEffectAudioElementRef.current = document.createElement("audio");
      soundEffectAudioElementRef.current.preload = "auto"; 
    }
  }, []);

  const playWarningAudio = useCallback(() => {
    if (soundEffectAudioElementRef.current) {
      soundEffectAudioElementRef.current.src = WARNING_AUDIO_SRC;
      soundEffectAudioElementRef.current.play().catch(error => {
        console.warn("REALTIME_HOOK: Warning audio playback failed:", error);
      });
    } else {
      console.warn("REALTIME_HOOK: Sound effect audio element not available for warning.");
    }
  }, []);

  const playDisconnectAudio = useCallback(() => {
    if (soundEffectAudioElementRef.current) {
      soundEffectAudioElementRef.current.src = DISCONNECT_AUDIO_SRC;
      soundEffectAudioElementRef.current.play().catch(error => {
        console.warn("REALTIME_HOOK: Disconnect audio playback failed:", error);
      });
    } else {
      console.warn("REALTIME_HOOK: Sound effect audio element not available for disconnect sound.");
    }
  }, []);

  const fetchEphemeralKey = useCallback(async (): Promise<string | null> => {
    console.log("Fetching ephemeral key...");
    try {
      const response = await fetch("/api/session");
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching ephemeral key:", errorData);
        setSessionStatus("ERROR");
        return null;
      }
      const data = await response.json();
      if (!data.client_secret?.value) {
        console.error("No client_secret in response:", data);
        setSessionStatus("ERROR");
        return null;
      }
      console.log("Ephemeral key fetched successfully.");
      ephemeralKeyRef.current = data.client_secret.value;
      return data.client_secret.value;
    } catch (error) {
      console.error("Network error fetching ephemeral key:", error);
      setSessionStatus("ERROR");
      return null;
    }
  }, []);

  const connect = useCallback(async () => {
    if (sessionStatus === "CONNECTING" || sessionStatus === "CONNECTED") {
      console.log("Already connecting or connected.");
      return;
    }

    setSessionStatus("CONNECTING");
    console.log("REALTIME_HOOK: connect invoked. currentAgentConfig name:", currentAgentConfig.name);
    const ephemeralKey = ephemeralKeyRef.current || (await fetchEphemeralKey()); // Use stored key or fetch if not present

    if (!ephemeralKey) {
      console.error("Failed to get ephemeral key for connection.");
      setSessionStatus("ERROR");
      return;
    }

    try {
      console.log("Attempting WebRTC connection...");
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.onicecandidateerror = (event) => {
        console.error("ICE candidate error:", event);
        // RTCErrorEvent - event.errorCode, event.errorText
        setSessionStatus("ERROR");
      };
  
      pc.oniceconnectionstatechange = () => {
        if (pcRef.current) {
          console.log("ICE connection state changed:", pcRef.current.iceConnectionState);
          if (pcRef.current.iceConnectionState === "failed" || 
              pcRef.current.iceConnectionState === "disconnected" || 
              pcRef.current.iceConnectionState === "closed") {
            // Don't treat connection state changes as errors during transfers or intentional disconnects
            if (!isTransferInProgress && !isIntentionalDisconnectRef.current && sessionStatus !== "DISCONNECTED") {
              console.warn("ICE connection state indicates connection issues:", pcRef.current.iceConnectionState);
              setSessionStatus("ERROR");
            } else {
              console.log("ICE connection state change during transfer/disconnect - this is expected:", pcRef.current.iceConnectionState);
            }
          }
        }
      };

      pc.ontrack = (e) => {
        console.log("Remote track received:", e.track);
        if (audioElementRef.current && e.streams[0]) {
          audioElementRef.current.srcObject = e.streams[0];
          audioElementRef.current.play().catch(error => console.warn("Audio autoplay failed:", error));
          setAgentAudioStream(e.streams[0]); // Store the agent's audio stream for visualization
        } else {
          console.warn("Audio element ref not available or no streams on track event");
        }
      };

      // Add error handling for track events
      pc.addEventListener('track', (e) => {
        e.track.addEventListener('ended', () => {
          console.log('Track ended:', e.track.kind);
          // Don't treat track ending as an error during transfers
          if (!isTransferInProgress && !isIntentionalDisconnectRef.current) {
            console.warn('Unexpected track ending detected');
          }
        });
        
        e.track.addEventListener('mute', () => {
          console.log('Track muted:', e.track.kind);
        });
        
        e.track.addEventListener('unmute', () => {
          console.log('Track unmuted:', e.track.kind);
        });
      });

      const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      userMediaStream.getTracks().forEach(track => pc.addTrack(track, userMediaStream));
      setUserAudioStream(userMediaStream); // Store the stream for visualization

      // Codec preference (using 'opus' as default from example)
      const codec = "opus"; 
      const capabilities = RTCRtpSender.getCapabilities("audio");
      if (capabilities) {
        const chosenCodec = capabilities.codecs.find(
          (c) => c.mimeType.toLowerCase() === `audio/${codec}`
        );
        if (chosenCodec) {
          const transceivers = pc.getTransceivers();
          if (transceivers.length > 0 && transceivers[0].sender && typeof transceivers[0].setCodecPreferences === 'function') {
             transceivers[0].setCodecPreferences([chosenCodec]);
             console.log("Set codec preference to:", chosenCodec);
          } else {
            console.warn("Could not set codec preferences: transceiver or method not available.")
          }
        } else {
          console.warn(
            `Codec "${codec}" not found in capabilities. Using default settings.`
          );
        }
      }

      const dc = pc.createDataChannel("oai-events"); // As per example lib
      dcRef.current = dc;

      dc.onopen = () => {
        console.log("REALTIME_HOOK: Data channel OPENED.");
        setSessionStatus("CONNECTED");

        // Reset flags for new session
        isIntentionalDisconnectRef.current = false;
        
        // Reset message count and warning flags for the new session
        messageCountRef.current = 0;
        messageLimitWarningPlayedRef.current = false;

        // Clear any existing timers
        if (callDurationTimerRef.current) clearTimeout(callDurationTimerRef.current);
        if (finalDisconnectTimerRef.current) clearTimeout(finalDisconnectTimerRef.current);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (idleWarningTimerRef.current) clearTimeout(idleWarningTimerRef.current);
        
        // Reset activity tracking
        lastActivityTimeRef.current = Date.now();
        
        // Start idle warning timer
        idleWarningTimerRef.current = setTimeout(() => {
          console.warn("REALTIME_HOOK: Idle warning period reached.");
          playWarningAudio();
          const idleWarningMsgId = `system-idle-warning-${Date.now()}`;
          setInternalMessages(prevMessages => {
            return [...prevMessages, { id: idleWarningMsgId, role: "user" as const, text: "[System: No activity detected. Call will end in 15 seconds if no response.]" }];
          });
        }, IDLE_WARNING_MS);
        
        // Start idle timeout timer
        idleTimerRef.current = setTimeout(() => {
          console.warn("REALTIME_HOOK: Idle timeout reached. Disconnecting.");
          const idleEndId = `system-idle-end-${Date.now()}`;
          setInternalMessages(prevMessages => {
            const endMessage: Message = { id: idleEndId, role: "user" as const, text: "[System: Call ended due to inactivity.]" };
            return [...prevMessages, endMessage];
          });
          onAgentEndedCall();
          disconnect();
        }, IDLE_TIMEOUT_MS);

        // Start call duration PRE-warning timer
        const preWarningDuration = MAX_CALL_DURATION_MS - CALL_DURATION_WARNING_PERIOD_MS;
        if (preWarningDuration > 0) {
          callDurationTimerRef.current = setTimeout(() => {
            console.warn("REALTIME_HOOK: Call duration pre-warning period reached.");
            playWarningAudio();
            const warningMsgId = `system-duration-warning-${Date.now()}`;
            setInternalMessages(prevMessages => {
              return [...prevMessages, { id: warningMsgId, role: "user" as const, text: `[System: Call approaching maximum duration. The call will end in ${CALL_DURATION_WARNING_PERIOD_MS / 1000} seconds.]` }];
            });

            // Set the final disconnect timer
            finalDisconnectTimerRef.current = setTimeout(() => {
              console.warn("REALTIME_HOOK: Maximum call duration reached after warning. Disconnecting.");
              const durationEndId = `system-duration-end-${Date.now()}`;
              setInternalMessages(prevMessages => {
                const endMessage: Message = { id: durationEndId, role: "user" as const, text: "[System: Call ended due to maximum duration.]" };
                return [...prevMessages, endMessage];
              });
              onAgentEndedCall(); // Notify client that call has effectively ended
              disconnect();
            }, CALL_DURATION_WARNING_PERIOD_MS);
          }, preWarningDuration);
        } else {
          // If warning period is longer than max duration, effectively just set timer for max duration
           finalDisconnectTimerRef.current = setTimeout(() => {
            console.warn("REALTIME_HOOK: Maximum call duration reached (no pre-warning due to config). Disconnecting.");
            const durationEndId = `system-duration-end-${Date.now()}`;
            setInternalMessages(prevMessages => {
              const endMessage: Message = { id: durationEndId, role: "user" as const, text: "[System: Call ended due to maximum duration.]" };
              return [...prevMessages, endMessage];
            });
            onAgentEndedCall(); // Notify client that call has effectively ended
            disconnect();
          }, MAX_CALL_DURATION_MS);
        }

        // Send initial session.update to configure the agent (Phase 2, Step 7)
        const agentInstructions = currentAgentConfig.instructions;
        
        // TODO: Consider adding a 'voice' field to AgentConfig for a cleaner way to set this.
        const agentVoice = currentAgentConfig.name.toLowerCase().includes("frontline") || currentAgentConfig.name.toLowerCase().includes("sarah") ? "coral" : "ash"; 
        console.log("REALTIME_HOOK: Configuring agent with name:", currentAgentConfig.name, "Voice:", agentVoice, "Instructions length:", agentInstructions.length);

        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: agentInstructions,
            voice: agentVoice,
            tools: currentAgentConfig.tools, // Added tools from AgentConfig
            input_audio_transcription: { model: "whisper-1", language: "en" }, // Using whisper-1 as a common choice
            turn_detection: { // Default VAD settings from openai-realtime-agents example
              type: "server_vad",
              threshold: 0.8, // Increased from 0.7 to be even less sensitive to noise
              prefix_padding_ms: 300,
              silence_duration_ms: 800, // Increased from 500ms to require longer pause before responding
              create_response: true, // Important: tells server to respond after VAD detects end of user speech
              interrupt_response: true // Allows agent to be interrupted
            },
            // start_first_turn: true,
            // For MVP, no client-side tools are defined here. 
            // Tools would be: tools: currentAgent?.tools || [] from the example.
          },
        };
        console.log("REALTIME_HOOK_DEBUG: Sending initial session.update event:", JSON.stringify(sessionUpdateEvent, null, 2));
        sendClientEvent(sessionUpdateEvent, "initial_session_config");
        
        // Send a simulated "hi" from the user and then prompt for a response
        // to make the agent speak first.
        const simulatedUserId = `simulated-user-${Date.now()}`; // Basic unique ID
        sendClientEvent({
          type: "conversation.item.create",
          item: {
            id: simulatedUserId,
            type: "message",
            role: "user",
            content: [{ type: "input_text", text: "Hello!" }],
          },
        }, "simulated_user_hi");
        sendClientEvent({ type: "response.create" }, "trigger_initial_agent_response");

        // Optionally, send a event to trigger the agent's first line (e.g. greeting)
        // The example repo sends a sendSimulatedUserMessage("hi");
        // For our case, the agent should start based on instructions. If a greeting is needed,
        // it should be part of the agent's initial behavior defined in instructions.
        // Or, we can send a specific event to prompt the first utterance if required.
        // For now, let's assume the configured agent starts the conversation.
      };

      dc.onclose = () => {
        console.log("Data channel CLOSED.");
        // If the data channel closes, and we are not already in a DISCONNECTED state,
        // then transition to DISCONNECTED. This handles unexpected closures.
        if (sessionStatus !== "DISCONNECTED") {
            console.log("Data channel closed, transitioning session to DISCONNECTED.");
            setSessionStatus("DISCONNECTED");
        }
      };

      dc.onerror = (err) => {
        // During transfers, data channel errors are expected as we're closing the connection
        if (isTransferInProgress || isIntentionalDisconnectRef.current) {
          console.log("Data channel error during transfer/disconnect - this is expected:", err);
          return; // Don't process as an error
        }
        
        // Only log and set error status if this is unexpected
        console.error("Unexpected data channel error:", err);
        if (sessionStatus !== "DISCONNECTED" && sessionStatus !== "ERROR" && !isIntentionalDisconnectRef.current) {
          setSessionStatus("ERROR");
        }
      };

      dc.onmessage = (event) => {
        // console.log("Data channel MESSAGE:", event.data);
        handleServerEvent(event.data);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("Local SDP offer created and set.");

      const baseUrl = "https://api.openai.com/v1/realtime";
      // Model name from the example, ensure it's up-to-date via OpenAI docs if issues arise
      const model = "gpt-4o-realtime-preview-2024-12-17"; 

      console.log(`Sending SDP offer to ${baseUrl}?model=${model}`);
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp, // sdp is a string
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpResponse.ok) {
        const errorBody = await sdpResponse.text();
        console.error(`SDP offer failed: ${sdpResponse.status} ${sdpResponse.statusText}`, errorBody);
        throw new Error(`SDP offer failed: ${sdpResponse.status} ${sdpResponse.statusText}`);
      }

      const answerSdp = await sdpResponse.text();
      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: answerSdp,
      };

      await pc.setRemoteDescription(answer);
      console.log("Remote SDP answer received and set. WebRTC connection should be established.");

    } catch (error) {
      console.error("Error during WebRTC connection setup:", error);
      setSessionStatus("ERROR");
      // Clean up if partial connection occurred
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (dcRef.current) {
        dcRef.current.close();
        dcRef.current = null;
      }
    }
  }, [sessionStatus, fetchEphemeralKey, currentAgentConfig, onUserTranscriptCompleted, onAgentEndedCall]);

  const disconnect = useCallback(() => {
    console.log("Disconnect function called. isIntentionalDisconnectRef:", isIntentionalDisconnectRef.current);
    
    // Set flag to indicate this is an intentional disconnect
    isIntentionalDisconnectRef.current = true;
    
    // Set status to DISCONNECTED first to prevent error handlers from triggering
    setSessionStatus("DISCONNECTED");
    
    // Clean up data channel first, with proper error handling
    if (dcRef.current) {
      try {
        // Remove all event handlers to prevent spurious errors
        dcRef.current.onopen = null;
        dcRef.current.onclose = null;
        dcRef.current.onerror = null;
        dcRef.current.onmessage = null;
        
        // Close the data channel if it's still open
        if (dcRef.current.readyState === "open" || dcRef.current.readyState === "connecting") {
          dcRef.current.close();
        }
      } catch (error) {
        console.log("Error during data channel cleanup (expected during transfers):", error);
      }
      dcRef.current = null;
    }
    
    // Clean up peer connection
    if (pcRef.current) {
      try {
        // Stop all tracks
        pcRef.current.getSenders().forEach((sender) => {
          if (sender.track) {
            sender.track.stop();
          }
        });
        
        // Close the peer connection
        if (pcRef.current.signalingState !== "closed") {
          pcRef.current.close();
        }
      } catch (error) {
        console.log("Error during peer connection cleanup:", error);
      }
      pcRef.current = null;
    }
    
    // Clean up audio element
    if (audioElementRef.current && audioElementRef.current.srcObject) {
        const stream = audioElementRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        audioElementRef.current.srcObject = null;
    }

    setIsAgentSpeaking(false);
    setUserAudioStream(null); // Clear the audio stream
    setAgentAudioStream(null); // Clear the agent audio stream
    // setInternalMessages([]); // Optionally clear messages on disconnect

    // Clear guardrail timers/refs
    if (callDurationTimerRef.current) {
      clearTimeout(callDurationTimerRef.current);
      callDurationTimerRef.current = null;
    }
    if (finalDisconnectTimerRef.current) {
        clearTimeout(finalDisconnectTimerRef.current);
        finalDisconnectTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (idleWarningTimerRef.current) {
      clearTimeout(idleWarningTimerRef.current);
      idleWarningTimerRef.current = null;
    }
    messageCountRef.current = 0; // Reset message count on disconnect
    messageLimitWarningPlayedRef.current = false; // Reset message warning flag
    setIsTransferInProgress(false); // Reset transfer in progress flag
    pendingTransferDetailsRef.current = null; // Clear any pending transfer
    pendingEndCallDetailsRef.current = null; // Clear any pending end call
    expectingAudioStopForTransferRef.current = false; // Reset audio stop expectation

    console.log("Disconnected. Clearing isIntentionalDisconnectRef after a delay.");
    
    // Reset the intentional disconnect flag after a short delay to ensure all cleanup is complete
    setTimeout(() => {
      isIntentionalDisconnectRef.current = false;
      console.log("isIntentionalDisconnectRef reset to false");
    }, 100);
  }, []);
  
  const resetIdleTimers = useCallback(() => {
    lastActivityTimeRef.current = Date.now();
    
    // Clear existing idle timers
    if (idleWarningTimerRef.current) {
      clearTimeout(idleWarningTimerRef.current);
      idleWarningTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    
    // Restart idle timers only if connected
    if (sessionStatus === "CONNECTED") {
      idleWarningTimerRef.current = setTimeout(() => {
        console.warn("REALTIME_HOOK: Idle warning period reached.");
        playWarningAudio();
        const idleWarningMsgId = `system-idle-warning-${Date.now()}`;
        setInternalMessages(prevMessages => {
          return [...prevMessages, { id: idleWarningMsgId, role: "user" as const, text: "[System: No activity detected. Call will end in 15 seconds if no response.]" }];
        });
      }, IDLE_WARNING_MS);
      
      idleTimerRef.current = setTimeout(() => {
        console.warn("REALTIME_HOOK: Idle timeout reached. Disconnecting.");
        const idleEndId = `system-idle-end-${Date.now()}`;
        setInternalMessages(prevMessages => {
          const endMessage: Message = { id: idleEndId, role: "user" as const, text: "[System: Call ended due to inactivity.]" };
          return [...prevMessages, endMessage];
        });
        onAgentEndedCall();
        disconnect();
      }, IDLE_TIMEOUT_MS);
    }
  }, [sessionStatus, playWarningAudio, onAgentEndedCall, disconnect]);
  
  // Ensure audioElement is created once
  useEffect(() => {
    if (!audioElementRef.current) {
      audioElementRef.current = document.createElement("audio");
      // audioElementRef.current.autoplay = true; // Autoplay can be tricky, manage play() calls carefully
    }
    return () => {
        // Cleanup audio element if necessary, though it's tied to hook lifecycle
        if (audioElementRef.current && audioElementRef.current.srcObject) {
            const stream = audioElementRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);


  const sendClientEvent = useCallback((eventObj: any, eventNameSuffix = "") => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      const eventType = eventObj.type || "unknown_event";
      const logSuffix = eventNameSuffix ? ` (${eventNameSuffix})` : "";
      console.log(`Sending client event: ${eventType}${logSuffix}`, eventObj);
      dcRef.current.send(JSON.stringify(eventObj));
    } else {
      const eventType = eventObj.type || "unknown_event_attempt";
      console.error(
        `Data channel not open. Failed to send event: ${eventType}`,
        eventObj
      );
      // Optionally, you could queue events or notify the user, but for MVP, error logging is fine.
    }
  }, [dcRef]); // dcRef itself won't change, but its readyState will. Dependency on dcRef.current.readyState isn't direct for useCallback.

  const handleTransferToolCall = useCallback((
    toolCall: { id?: string; call_id?: string; name?: string; args?: string; arguments?: string }, // call_id for response.done, id for response.updated
    isFromResponseDone: boolean,
    hasAudioInSameResponse: boolean = false
  ): boolean => { // Returns true if transfer was initiated (either deferred or immediate)
    if (isTransferInProgress && !pendingTransferDetailsRef.current) { // if a transfer is truly in progress and not just pending speech
        console.warn("REALTIME_HOOK_DEBUG: Transfer already in progress, ignoring new transfer request:", toolCall.name);
        return false;
    }

    const toolCallId = isFromResponseDone ? toolCall.call_id! : toolCall.id!;
    const toolName = toolCall.name!;
    const rawArgs = isFromResponseDone ? toolCall.arguments : toolCall.args;

    let targetAgentName = "";
    if (toolName.startsWith("transfer_to_")) {
        targetAgentName = toolName.substring("transfer_to_".length);
    } else if (toolName === "transferToSupervisor") {
        // Default to supervisor or extract from args if available
    }

    console.log(`REALTIME_HOOK_DEBUG: Handling potential transfer tool: ${toolName}, ID: ${toolCallId}`);

    let parsedArgs: { reason?: string; conversation_summary?: string; destination_agent_name?: string } = { reason: "N/A", conversation_summary: "N/A" };
    try {
        if (rawArgs) {
            parsedArgs = JSON.parse(rawArgs);
            if (parsedArgs.destination_agent_name && !targetAgentName) {
                targetAgentName = parsedArgs.destination_agent_name;
            }
        }
    } catch (e) {
        console.error("REALTIME_HOOK_DEBUG: Failed to parse tool call arguments:", e, "Raw args:", rawArgs);
    }
    
    if (!targetAgentName) { // If still no targetAgentName, attempt to derive from common patterns or default
      if (toolName === "transferToSupervisor") targetAgentName = "supervisor"; // Example default
      // else you might have other logic or decide it's an error
    }

    if (!targetAgentName) {
        console.warn("REALTIME_HOOK_DEBUG: Could not determine target agent for transfer. Tool:", toolName);
        // Optionally send a negative tool response if appropriate
        return false;
    }
    
    console.log(`REALTIME_HOOK_DEBUG: Confirmed transfer. Target: ${targetAgentName}, hasAudioInSameResponse: ${hasAudioInSameResponse}`);
    setIsTransferInProgress(true); // Set this as soon as we decide to handle the transfer

    const transferDetailsForPending = {
        toolCallId,
        targetAgentName,
        transferArgs: { reason: parsedArgs.reason, conversation_summary: parsedArgs.conversation_summary }
    };

    // Always defer if there's audio in the same response
    if (hasAudioInSameResponse) {
        console.log("REALTIME_HOOK_DEBUG: Audio detected in same response. Deferring entire transfer (including tool response) to:", targetAgentName);
        pendingTransferDetailsRef.current = transferDetailsForPending;
        expectingAudioStopForTransferRef.current = true;
        const transferMsgId = `system-transfer-pending-${Date.now()}`;
        const transferText = `[System: Preparing to transfer to ${targetAgentName}. Please wait for the current agent to finish speaking...]`;
        setInternalMessages(prev => [...prev, { id: transferMsgId, role: 'user', text: transferText }]);
        // DO NOT send tool response yet - defer it until audio stops
    } else if (isAgentSpeaking) {
        console.log("REALTIME_HOOK_DEBUG: Agent is speaking. Deferring entire transfer (including tool response) to:", targetAgentName);
        pendingTransferDetailsRef.current = transferDetailsForPending;
        const transferMsgId = `system-transfer-pending-${Date.now()}`;
        const transferText = `[System: Preparing to transfer to ${targetAgentName}. Please wait for the current agent to finish speaking...]`;
        setInternalMessages(prev => [...prev, { id: transferMsgId, role: 'user', text: transferText }]);
        // DO NOT send tool response yet - defer it until audio stops
    } else {
        console.log("REALTIME_HOOK_DEBUG: No audio in response and agent is not speaking. Proceeding with immediate transfer to:", targetAgentName);
        
        // Send tool response with a small delay to ensure it's processed
        setTimeout(() => {
          const toolResponseResult = { status: "Transfer initiated.", detail: `Transferring to ${targetAgentName}` };
          const toolResponseEvent = {
              type: "response.update",
              response: {
                  tool_responses: [{
                      tool_call_id: toolCallId,
                      result: JSON.stringify(toolResponseResult)
                  }]
              }
          };
          sendClientEvent(toolResponseEvent, "transfer_tool_call_response");
        }, 50); // Small delay to ensure data channel is ready
        
        const transferMsgId = `system-transfer-immediate-${Date.now()}`;
        const transferText = `[System: Transferring to ${targetAgentName}${parsedArgs.reason !== "N/A" ? ` (Reason: ${parsedArgs.reason})` : ''}...]`;
        setInternalMessages(prev => [...prev, { id: transferMsgId, role: 'user', text: transferText }]);
        
        // Disconnect with a longer delay to ensure tool response is sent
        setTimeout(() => {
          // Set intentional disconnect flag BEFORE disconnecting to prevent error logging
          isIntentionalDisconnectRef.current = true;
          disconnect(); // This will also set isTransferInProgress to false and clear pendingTransferDetailsRef
          
          if (onAgentTransferRequested) {
              console.log("REALTIME_HOOK_DEBUG: Calling onAgentTransferRequested (immediate) for target:", targetAgentName, "with args:", parsedArgs);
              onAgentTransferRequested(targetAgentName, { reason: parsedArgs.reason, conversation_summary: parsedArgs.conversation_summary });
          } else {
              console.warn("REALTIME_HOOK_DEBUG: onAgentTransferRequested callback is not provided (immediate).");
          }
        }, 200); // 200ms delay to ensure tool response is sent before disconnect
    }
    return true; // Transfer was handled (either deferred or immediate)
  }, [isAgentSpeaking, sendClientEvent, setInternalMessages, disconnect, onAgentTransferRequested, isTransferInProgress]);

  const handleEndCallToolCall = useCallback((
    toolCall: { id?: string; call_id?: string; name?: string; args?: string; arguments?: string }, // call_id for response.done, id for response.updated
    hasAudioInSameResponse: boolean = false
  ): boolean => { // Returns true if end call was initiated
    const toolCallId = toolCall.call_id || toolCall.id;
    const rawArgs = toolCall.arguments || toolCall.args;

    console.log(`REALTIME_HOOK_DEBUG: Handling end_call tool: ${toolCall.name}, ID: ${toolCallId}`);

    let parsedArgs: { reason?: string } = { reason: "Agent ended call" };
    try {
        if (rawArgs) {
            parsedArgs = JSON.parse(rawArgs);
        }
    } catch (e) {
        console.error("REALTIME_HOOK_DEBUG: Failed to parse end_call arguments:", e, "Raw args:", rawArgs);
    }
    
    // If there's audio in the same response or agent is speaking, defer the entire process
    if (hasAudioInSameResponse || isAgentSpeaking) {
        console.log("REALTIME_HOOK_DEBUG: End call tool called with audio or agent speaking. Deferring tool response and call end.");
        
        // Store the pending end call details
        pendingEndCallDetailsRef.current = {
            toolCallId: toolCallId!,
            reason: parsedArgs.reason || "Agent ended call"
        };
        
        // Set the flag to handle the actual call end after audio stops
        agentInitiatedCallEndRef.current = true;
        
        // DO NOT send tool response yet - it will be sent when audio stops
        
    } else {
        console.log("REALTIME_HOOK_DEBUG: No audio and agent not speaking. Ending call immediately.");
        
        // Send tool response immediately since there's no audio
        const toolResponseResult = { status: "Call ended", detail: parsedArgs.reason || "Agent ended call" };
        const toolResponseEvent = {
            type: "response.update",
            response: {
                tool_responses: [{
                    tool_call_id: toolCallId,
                    result: JSON.stringify(toolResponseResult)
                }]
            }
        };
        sendClientEvent(toolResponseEvent, "end_call_tool_response_immediate");
        
        // Play disconnect sound and notify
        playDisconnectAudio();
        onAgentEndedCall();
        
        // Disconnect after a small delay
        setTimeout(() => {
            disconnect();
        }, 500);
    }
    return true;
  }, [isAgentSpeaking, sendClientEvent, setInternalMessages, disconnect, onAgentEndedCall, playDisconnectAudio]);

  const handleServerEvent = useCallback((eventString: string) => {
    let serverEvent;
    try {
      serverEvent = JSON.parse(eventString);
    } catch (error) {
      console.error("REALTIME_HOOK_DEBUG: Failed to parse server event JSON:", error, "Event string:", eventString);
      return;
    }

    // Only log specific events that are relevant for debugging transfers and important state changes
    const eventsToLog = [
      "session.created",
      "response.updated", 
      "response.done",
      "response.function_call_arguments.done",
      // "conversation.item.created",
      "conversation.item.input_audio_transcription.completed"
    ];
    
    if (eventsToLog.includes(serverEvent.type)) {
      console.log(`REALTIME_HOOK_DEBUG: ${serverEvent.type} event received`, serverEvent);
    }

    switch (serverEvent.type) {
      case "session.created":
        // Session status is already set to CONNECTED when data channel opens.
        // Log session ID or other details if needed.
        console.log("Server confirmed session.created:", serverEvent.session?.id);
        // Potentially add a breadcrumb to transcript here if desired.
        break;

      case "input_audio_buffer.speech_started":
        setIsUserSpeaking(true);
        if (onUserSpeakingChange) {
          onUserSpeakingChange(true);
        }
        resetIdleTimers(); // Reset idle timers on user activity
        console.log("REALTIME_HOOK_DEBUG: input_audio_buffer.speech_started - User is now speaking");
        break;

      case "input_audio_buffer.speech_stopped":
        setIsUserSpeaking(false);
        if (onUserSpeakingChange) {
          onUserSpeakingChange(false);
        }
        console.log("REALTIME_HOOK_DEBUG: input_audio_buffer.speech_stopped - User stopped speaking");
        break;

      case "output_audio_buffer.started":
        setIsAgentSpeaking(true);
        console.log("REALTIME_HOOK_DEBUG: output_audio_buffer.started - Agent is now speaking");
        break;

      case "output_audio_buffer.stopped":
        setIsAgentSpeaking(false);
        console.log("REALTIME_HOOK_DEBUG: output_audio_buffer.stopped - Agent stopped speaking");
        // Check if this audio stop corresponds to the agent saying goodbye OR a pending transfer
        if (pendingTransferDetailsRef.current) {
            const { toolCallId, targetAgentName, transferArgs } = pendingTransferDetailsRef.current;
            console.log("REALTIME_HOOK: Agent finished speaking, completing deferred transfer to:", targetAgentName);
            
            // NOW send the tool response
            const toolResponseResult = { status: "Transfer initiated.", detail: `Transferring to ${targetAgentName}` };
            const toolResponseEvent = {
                type: "response.update",
                response: {
                    tool_responses: [{
                        tool_call_id: toolCallId,
                        result: JSON.stringify(toolResponseResult)
                    }]
                }
            };
            sendClientEvent(toolResponseEvent, "deferred_transfer_tool_call_response");
            
            const transferMsgId = `system-transfer-complete-${Date.now()}`;
            const transferText = `[System: Completing transfer to ${targetAgentName}${transferArgs.reason !== "N/A" ? ` (Reason: ${transferArgs.reason})` : ''}...]`;
            setInternalMessages(prev => {
                // Remove any "Preparing to transfer..." message if it exists by its typical prefix or a more robust ID system
                const filteredMessages = prev.filter(msg => !msg.text.startsWith("[System: Preparing to transfer"));
                return [...filteredMessages, {id: transferMsgId, role: 'user', text: transferText}];
            });

            // Small delay to ensure tool response is sent before disconnect
            setTimeout(() => {
                // Set intentional disconnect flag BEFORE disconnecting to prevent error logging
                isIntentionalDisconnectRef.current = true;
                disconnect(); // This will also set isTransferInProgress to false and clear pendingTransferDetailsRef

                if (onAgentTransferRequested) {
                    console.log("REALTIME_HOOK_DEBUG: Calling onAgentTransferRequested (deferred) for target:", targetAgentName, "with args:", transferArgs);
                    onAgentTransferRequested(targetAgentName, transferArgs);
                } else {
                    console.warn("REALTIME_HOOK_DEBUG: onAgentTransferRequested callback is not provided (deferred).");
                }
            }, 100); // 100ms delay to ensure tool response is processed

            agentInitiatedCallEndRef.current = false; // Ensure goodbye sound doesn't play during transfer
            expectingAudioStopForTransferRef.current = false; // Clear the audio stop expectation
            // pendingTransferDetailsRef.current is cleared by disconnect()
            return; // Transfer handled, skip goodbye logic
        }

        // Check for pending end call
        if (pendingEndCallDetailsRef.current && agentInitiatedCallEndRef.current) {
            const { toolCallId, reason } = pendingEndCallDetailsRef.current;
            console.log("REALTIME_HOOK: Agent finished speaking, completing deferred end call.");
            
            // NOW send the tool response
            const toolResponseResult = { status: "Call ended", detail: reason };
            const toolResponseEvent = {
                type: "response.update",
                response: {
                    tool_responses: [{
                        tool_call_id: toolCallId,
                        result: JSON.stringify(toolResponseResult)
                    }]
                }
            };
            sendClientEvent(toolResponseEvent, "deferred_end_call_tool_response");
            
            // Play disconnect sound and notify
            playDisconnectAudio();
            onAgentEndedCall();
            
            // Clear the pending details and flag
            pendingEndCallDetailsRef.current = null;
            agentInitiatedCallEndRef.current = false;
            
            // Disconnect after a small delay to ensure tool response is processed
            setTimeout(() => {
                disconnect();
            }, 100);
            
            return; // End call handled
        }

        // Legacy path for backward compatibility (if still needed)
        if (agentInitiatedCallEndRef.current) {
          console.log("REALTIME_HOOK: Agent finished speaking after initiating call end (legacy path), playing disconnect sound and calling onAgentEndedCall.");
          playDisconnectAudio(); // Play disconnect sound
          onAgentEndedCall();
          agentInitiatedCallEndRef.current = false; // Reset the flag
        }
        break;

      case "conversation.item.created": {
        const { item } = serverEvent;
        if (item?.id && item.role && item.content?.[0]?.text) {
          setInternalMessages(prevMessages => {
            if (!prevMessages.find(msg => msg.id === item.id)) {
              // If it's our simulated message to kickstart the agent, don't add it to the transcript.
              if (item.id.startsWith("simulated-user-")) {
                  console.log("REALTIME_HOOK: Ignoring simulated user message for transcript:", item.id);
                  return prevMessages;
              }
              messageCountRef.current += 1; // Increment for actual messages
              
              // Extract a display name. For assistant, it could be from publicDescription or name.
              const agentDisplayName = currentAgentConfig.publicDescription.split(",")[0] || currentAgentConfig.name;
              const displayRole = item.role === "user" ? "user" : agentDisplayName;

              // Ensure the new message object from server event data strictly conforms to Message type
              const newMessage: Message = { 
                id: String(item.id), // Convert item.id (any) to string
                role: displayRole,     // displayRole is already correctly typed
                text: String(item.content[0].text) // Convert item.content[0].text (any) to string
              };
              const newMessagesSoFar: Message[] = [...prevMessages, newMessage];
              
              if (!messageLimitWarningPlayedRef.current && messageCountRef.current >= MAX_MESSAGES * MESSAGE_WARNING_THRESHOLD_FACTOR) {
                console.warn("REALTIME_HOOK: Message limit warning threshold reached.");
                playWarningAudio();
                messageLimitWarningPlayedRef.current = true; 
                const warningMsgId = `system-message-warning-${Date.now()}`;
                // The warning message itself is already correctly typed with "user" as const
                return [...newMessagesSoFar, { id: warningMsgId, role: "user" as const, text: "[System: Approaching message limit. The call may end soon.]" }];
              }
              return newMessagesSoFar;
            }
            return prevMessages;
          });
          // Flag is now set inside setInternalMessages updater
        } else if (item?.id && item.role === "user" && item.content?.[0]?.type === "input_audio"){
            setInternalMessages(prevMessages => {
                if (!prevMessages.find(msg => msg.id === item.id)) {
                    messageCountRef.current += 1; 
                    const newMessagesSoFar = [...prevMessages, { id: item.id, role: "user" as const, text: "[Transcribing...]" }];
                    if (!messageLimitWarningPlayedRef.current && messageCountRef.current >= MAX_MESSAGES * MESSAGE_WARNING_THRESHOLD_FACTOR) {
                        console.warn("REALTIME_HOOK: Message limit warning threshold reached (user audio start).");
                        playWarningAudio();
                        messageLimitWarningPlayedRef.current = true;
                        const warningMsgId = `system-message-warning-${Date.now()}`;
                        const warningMessage: Message = { id: warningMsgId, role: "user" as const, text: "[System: Approaching message limit. The call may end soon.]" };
                        return [...newMessagesSoFar, warningMessage];
                    }
                    return newMessagesSoFar;
                }
                return prevMessages;
            });
            // Flag is now set inside setInternalMessages updater
        }

        // Check message count guardrail AFTER adding the message and potential warning
        if (messageCountRef.current >= MAX_MESSAGES) {
          console.warn("REALTIME_HOOK: Maximum message count reached. Disconnecting.");
          // Add a message to the transcript indicating why the call ended
           const messageLimitEndId = `system-msg-limit-end-${Date.now()}`;
           setInternalMessages(prevMessages => {
             const endMessage: Message = { id: messageLimitEndId, role: "user" as const, text: "[System: Call ended due to maximum message limit.]" };
             return [...prevMessages, endMessage];
           });
          onAgentEndedCall(); // Notify client that call has effectively ended
          disconnect();
          return; // Stop further processing for this event
        }
        break;
      }

      case "conversation.item.input_audio_transcription.completed": {
        const { item_id, transcript } = serverEvent;
        const finalText = transcript && transcript.trim() !== "" ? transcript.trim() : "[inaudible]";
        if (item_id) {
          setInternalMessages(prevMessages => {
            const existingMsgIndex = prevMessages.findIndex(msg => msg.id === item_id);
            if (existingMsgIndex !== -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[existingMsgIndex] = { ...updatedMessages[existingMsgIndex], text: finalText };
              return updatedMessages;
            } else {
              // This case (new message on transcription completion) is less common if placeholders are used,
              // but handle it for robustness. messageCountRef should ideally be incremented by originating event.
              // For simplicity, we won't add a new warning trigger here, assuming previous events handled it.
              const agentName = currentAgentConfig.name;
              // If this truly is a new message, it implies an issue with earlier tracking.
              // console.warn("REALTIME_HOOK: New message created on transcription completion for item_id:", item_id);
              // messageCountRef.current += 1; // Avoid double counting if possible
              return [...prevMessages, { id: item_id, role: agentName, text: finalText }];
            }
          });
          if (onUserTranscriptCompleted) {
            console.log("REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with:", finalText);
            onUserTranscriptCompleted(finalText);
          }

          // Hard stop if max messages reached (post-update)
          if (messageCountRef.current >= MAX_MESSAGES) {
            console.warn("REALTIME_HOOK: Maximum message count reached (after transcription completion). Disconnecting.");
            const messageLimitTranscriptionEndId = `system-msg-limit-transcription-end-${Date.now()}`;
            setInternalMessages(prevMessages => {
              const endMessage: Message = { id: messageLimitTranscriptionEndId, role: "user" as const, text: "[System: Call ended due to maximum message limit.]" };
              return [...prevMessages, endMessage];
            });
            onAgentEndedCall(); // Notify client that call has effectively ended
            disconnect();
            return; 
          }
        }
        break;
      }

      case "response.audio_transcript.delta": {
        const { item_id, delta } = serverEvent;
        if (item_id && delta) {
          let isNewMessage = false;
          assistantMessageDeltasRef.current[item_id] = (assistantMessageDeltasRef.current[item_id] || "") + delta;
          const fullText = assistantMessageDeltasRef.current[item_id];

          setInternalMessages(prevMessages => {
            const existingMsgIndex = prevMessages.findIndex(msg => msg.id === item_id);
            if (existingMsgIndex !== -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[existingMsgIndex] = { ...updatedMessages[existingMsgIndex], text: fullText };
              return updatedMessages;
            } else {
              // Agent started speaking, create a new message item
              isNewMessage = true; 
              const agentDisplayName = currentAgentConfig.publicDescription.split(",")[0] || currentAgentConfig.name;
              // We will check for warning after this potential new message is added and count incremented
              return [...prevMessages, { id: item_id, role: agentDisplayName, text: fullText }];
            }
          });

          if (isNewMessage) {
            messageCountRef.current += 1;
            // Check for message limit warning (after potential increment)
            if (!messageLimitWarningPlayedRef.current && messageCountRef.current >= MAX_MESSAGES * MESSAGE_WARNING_THRESHOLD_FACTOR) {
                console.warn("REALTIME_HOOK: Message limit warning threshold reached (agent delta).");
                playWarningAudio();
                messageLimitWarningPlayedRef.current = true; 
                const warningMsgId = `system-message-warning-${Date.now()}`;
                // Add warning message via a new state update. 
                // This needs to be done carefully if the current message is also being updated.
                setInternalMessages(prevMessages => {
                    // Add the warning as a new, separate message.
                    return [...prevMessages, { id: warningMsgId, role: "user" as const, text: "[System: Approaching message limit. The call may end soon.]" }];
                });
            }

            // Check message count guardrail AFTER adding/updating the message
            if (messageCountRef.current >= MAX_MESSAGES) {
              console.warn("REALTIME_HOOK: Maximum message count reached (during delta). Disconnecting.");
              const messageLimitDeltaEndId = `system-msg-limit-delta-end-${Date.now()}`;
              setInternalMessages(prevMessages => {
                const endMessage: Message = { id: messageLimitDeltaEndId, role: "user" as const, text: "[System: Call ended due to maximum message limit.]" };
                return [...prevMessages, endMessage];
              });
              onAgentEndedCall(); // Notify client that call has effectively ended
              disconnect();
              return; // Stop further processing for this event
            }
          }
        }
        break;
      }
      
      case "response.done": {
        const responseOutput = serverEvent.response?.output;
        if (responseOutput && Array.isArray(responseOutput)) {
            console.log("REALTIME_HOOK_DEBUG: Processing 'response.done' event. Output items:", JSON.stringify(responseOutput, null, 2));
            
            // Check if this response contains both audio and a transfer function call
            let hasAudioMessage = false;
            let transferFunctionCall = null;
            
            for (const outputItem of responseOutput) {
                if (outputItem.type === "message" && outputItem.role === "assistant" && outputItem.content?.[0]?.type === "audio") {
                    hasAudioMessage = true;
                }
                if (outputItem.type === "function_call" && (outputItem.name?.startsWith("transfer_to_") || outputItem.name === "transferToSupervisor")) {
                    transferFunctionCall = outputItem;
                }
            }
            
            console.log(`REALTIME_HOOK_DEBUG: response.done analysis - hasAudioMessage: ${hasAudioMessage}, hasTransferFunctionCall: ${!!transferFunctionCall}`);
            
            let transferHandled = false;
            responseOutput.forEach((outputItem: any) => {
                if (outputItem.type === "message" && outputItem.role === "assistant" && outputItem.id) {
                    const finalAssistantText = outputItem.content?.[0]?.transcript || assistantMessageDeltasRef.current[outputItem.id] || "";
                     if (finalAssistantText) {
                        setInternalMessages(prevMessages => {
                            if (isTransferInProgress && !pendingTransferDetailsRef.current) return prevMessages; // Don't update messages if actual transfer (not just pending) started
                            const existingMsgIndex = prevMessages.findIndex(msg => msg.id === outputItem.id);
                            if (existingMsgIndex !== -1) {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[existingMsgIndex] = { ...updatedMessages[existingMsgIndex], text: finalAssistantText };
                                return updatedMessages;
                            } else {
                                // This case (new message on response.done) is less common if deltas are primary.
                                // messageCountRef.current += 1; // Avoid double counting if possible
                                const agentDisplayName = currentAgentConfig.publicDescription.split(",")[0] || currentAgentConfig.name;
                                // For simplicity, we won't add a new warning trigger here.
                                return [...prevMessages, { id: outputItem.id, role: agentDisplayName, text: finalAssistantText }];
                            }
                        });

                        // Text detection for goodbye removed - now handled via tool calls
                    }
                    // Clear accumulated delta for this item_id as it's now final
                    if (assistantMessageDeltasRef.current[outputItem.id]) {
                        delete assistantMessageDeltasRef.current[outputItem.id];
                    }
                } else if (outputItem.type === "function_call" && outputItem.status === "completed") {
                    // Handle function calls that appear in response.done
                    console.log("REALTIME_HOOK_DEBUG: Detected 'function_call' in 'response.done'. Name:", outputItem.name, "Arguments:", outputItem.arguments);
                    
                    if (isTransferInProgress) {
                        console.warn("REALTIME_HOOK_DEBUG: Ignoring function_call because isTransferInProgress =", isTransferInProgress);
                        return; // Skip this item
                    }
                    
                    if (outputItem.name?.startsWith("transfer_to_") || outputItem.name === "transferToSupervisor") {
                        console.log("REALTIME_HOOK_DEBUG: Matched transfer tool in response.done:", outputItem.name, "ID:", outputItem.call_id);
                        if (handleTransferToolCall(outputItem, true, hasAudioMessage)) {
                            console.log("REALTIME_HOOK_DEBUG: Transfer handled by handleTransferToolCall (from response.done). Breaking from outputItem loop.");
                            transferHandled = true; // Signal to break from forEach
                        }
                        // The old logic is now inside handleTransferToolCall
                        // setIsTransferInProgress(true); 
                        // ... rest of the old logic removed ...
                    } else if (outputItem.name === "end_call") {
                        console.log("REALTIME_HOOK_DEBUG: Matched end_call tool in response.done:", outputItem.name, "ID:", outputItem.call_id);
                        if (handleEndCallToolCall(outputItem, hasAudioMessage)) {
                            console.log("REALTIME_HOOK_DEBUG: End call handled by handleEndCallToolCall (from response.done).");
                        }
                    } else {
                        console.log("REALTIME_HOOK_DEBUG: Function call name did not match transfer or end_call pattern:", outputItem.name);
                    }
                }
                if (transferHandled) return; // Exit forEach if transfer was handled
            });
        }
        // Hard stop if max messages reached (post-update, after response.done processing)
        if (messageCountRef.current >= MAX_MESSAGES) {
          console.warn("REALTIME_HOOK: Maximum message count reached (after response.done). Disconnecting.");
          const messageLimitResponseDoneEndId = `system-msg-limit-response-done-end-${Date.now()}`;
          setInternalMessages(prevMessages => {
            if (isTransferInProgress) return prevMessages; // Don't update messages if transfer started
            const endMessage: Message = { id: messageLimitResponseDoneEndId, role: "user" as const, text: "[System: Call ended due to maximum message limit.]" };
            return [...prevMessages, endMessage];
          });
          if (!isTransferInProgress) { // Only call if not already disconnecting for transfer
            onAgentEndedCall(); // Notify client that call has effectively ended
            disconnect();
          }
          return; 
        }
        if (!isTransferInProgress) { // Avoid logging if transfer is happening
            console.log("Server response.done event received.");
        }
        break;
      }

      // Based on openai-realtime-agents, tool_calls are often part of response.updated
      case "response.updated": {
        console.log("REALTIME_HOOK_DEBUG: Received 'response.updated' event:", JSON.stringify(serverEvent, null, 2));
        const { response } = serverEvent;
        if (response?.output?.length > 0) {
          // Check if this response contains audio (similar to response.done)
          let hasAudioInResponse = false;
          for (const outputItem of response.output) {
            if (outputItem.type === "message" && outputItem.message?.content?.[0]?.type === "audio") {
              hasAudioInResponse = true;
              break;
            }
          }

          for (const outputItem of response.output) {
            if (outputItem.type === "tool_calls" && outputItem.tool_calls?.length > 0) {
              console.log("REALTIME_HOOK_DEBUG: Detected 'tool_calls' in 'response.updated'. Count:", outputItem.tool_calls.length, "Tool calls:", JSON.stringify(outputItem.tool_calls, null, 2));
              if (isTransferInProgress) {
                console.warn("REALTIME_HOOK_DEBUG: Ignoring tool_calls because isTransferInProgress =", isTransferInProgress);
                break; 
              }

              for (const toolCall of outputItem.tool_calls) {
                console.log("REALTIME_HOOK_DEBUG: Processing toolCall:", JSON.stringify(toolCall, null, 2));
                if (toolCall.name?.startsWith("transfer_to_") || toolCall.name === "transferToSupervisor") {
                  console.log("REALTIME_HOOK_DEBUG: Matched transfer tool in response.updated:", toolCall.name, "ID:", toolCall.id);
                  if (handleTransferToolCall(toolCall, false, hasAudioInResponse)) {
                     console.log("REALTIME_HOOK_DEBUG: Transfer handled by handleTransferToolCall (from response.updated). Breaking from tool_calls loop.");
                     break; // Break from the inner loop (toolCall of outputItem.tool_calls)
                  }
                  // The old logic is now inside handleTransferToolCall
                  // if (isTransferInProgress) { ... continue; }
                  // setIsTransferInProgress(true); 
                  // ... rest of the old logic removed ...
                } else if (toolCall.name === "end_call") {
                  console.log("REALTIME_HOOK_DEBUG: Matched end_call tool in response.updated:", toolCall.name, "ID:", toolCall.id);
                  if (handleEndCallToolCall(toolCall, hasAudioInResponse)) {
                     console.log("REALTIME_HOOK_DEBUG: End call handled by handleEndCallToolCall (from response.updated).");
                     break; // Break from the tool_calls loop
                  }
                } else {
                  console.log("REALTIME_HOOK_DEBUG: Tool call name did not match transfer or end_call pattern:", toolCall.name);
                }
              }
              // If a transfer was handled and we broke from the inner loop, we might want to break from the outer loop too.
              // Check if isTransferInProgress was set to true by handleTransferToolCall and is not just pending.
              if (isTransferInProgress && !pendingTransferDetailsRef.current) {
                  console.log("REALTIME_HOOK_DEBUG: Actual transfer initiated in response.updated. Breaking from outputItem loop.");
                  break; // Break from the outer loop (outputItem of response.output)
              }
            }
            // Potentially handle other outputItem types here if needed, e.g., regular messages within response.updated
            if (outputItem.type === "message" && outputItem.message) {
                // This is a simplified way to handle a full message object if it arrives in response.updated
                // This logic is similar to conversation.item.created but for a complete message snapshot.
                const { id, role, content } = outputItem.message;
                if (id && role && content?.[0]?.text) {
                    setInternalMessages(prevMessages => {
                        if (!prevMessages.find(msg => msg.id === id)) {
                            if (id.startsWith("simulated-user-")) {
                                return prevMessages;
                            }
                            messageCountRef.current += 1;
                            const agentDisplayName = currentAgentConfig.publicDescription.split(",")[0] || currentAgentConfig.name;
                            const displayRole = role === "user" ? "user" : agentDisplayName;
                            const newMessage: Message = { id: String(id), role: displayRole, text: String(content[0].text) };
                            // Warning logic can be duplicated/refactored if message creation is common here
                            return [...prevMessages, newMessage];
                        }
                        return prevMessages;
                    });
                }
            }
          }
        }
        break;
      }

      default:
        // console.log("Unhandled server event type:", serverEvent.type);
        break;
    }
  }, [setInternalMessages, setIsAgentSpeaking, setIsUserSpeaking, onUserTranscriptCompleted, onAgentEndedCall, currentAgentConfig, disconnect, onAgentTransferRequested, sendClientEvent, isTransferInProgress, sessionStatus, playWarningAudio, playDisconnectAudio, handleTransferToolCall, handleEndCallToolCall, isAgentSpeaking, onUserSpeakingChange, resetIdleTimers]); // Added sessionStatus to dependency array

  return {
    connect,
    disconnect,
    sessionStatus,
    messages: internalMessages, // Expose internal messages
    isAgentSpeaking,
    isUserSpeaking, // Expose user speaking state
    userAudioStream, // Expose user audio stream for visualization
    agentAudioStream, // Expose agent audio stream for visualization
    // TODO: Expose other necessary functions like sending user audio/text
    // Add a way to get the current message count or duration if needed by UI
    // TODO: Consider how to handle UI updates for warnings (e.g. visual timer)
  };
} 