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
}

export function useRealtimeNegotiation({
  onMessagesUpdate,
  onAgentSpeakingChange,
  onSessionStatusChange,
  currentAgentConfig,
  onUserTranscriptCompleted,
  onAgentEndedCall,
  onAgentTransferRequested,
}: UseRealtimeNegotiationProps) {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");
  const [internalMessages, setInternalMessages] = useState<Message[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [isTransferInProgress, setIsTransferInProgress] = useState<boolean>(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const ephemeralKeyRef = useRef<string | null>(null);
  const assistantMessageDeltasRef = useRef<{ [itemId: string]: string }>({}); // To accumulate deltas
  const agentHasSaidGoodbyeRef = useRef<boolean>(false); // Added this ref

  // Guardrail Refs
  const callDurationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageCountRef = useRef<number>(0);
  const soundEffectAudioElementRef = useRef<HTMLAudioElement | null>(null); // Renamed from warningAudioElementRef
  const finalDisconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageLimitWarningPlayedRef = useRef<boolean>(false);

  // Constants for guardrails and sound effects
  const MAX_CALL_DURATION_MS = 10 * 60 * 1000; // 10 minutes
  const MAX_MESSAGES = 100; // Max 100 messages (user + agent)
  const WARNING_AUDIO_SRC = "/audio/warning.mp3"; 
  const DISCONNECT_AUDIO_SRC = "/audio/disconnect.mp3"; // For agent-initiated disconnect
  const CALL_DURATION_WARNING_PERIOD_MS = 30 * 1000; // 30 seconds warning
  const MESSAGE_WARNING_THRESHOLD_FACTOR = 0.9; // Warn at 90% of max messages

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
            // Can consider a more nuanced status or retry, but for MVP ERROR is fine
            // if (sessionStatus !== "DISCONNECTED") setSessionStatus("ERROR");
          }
        }
      };

      pc.ontrack = (e) => {
        console.log("Remote track received:", e.track);
        if (audioElementRef.current && e.streams[0]) {
          audioElementRef.current.srcObject = e.streams[0];
          audioElementRef.current.play().catch(error => console.warn("Audio autoplay failed:", error));
        } else {
          console.warn("Audio element ref not available or no streams on track event");
        }
      };

      const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      userMediaStream.getTracks().forEach(track => pc.addTrack(track, userMediaStream));

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

        // Reset message count and warning flags for the new session
        messageCountRef.current = 0;
        messageLimitWarningPlayedRef.current = false;

        // Clear any existing timers
        if (callDurationTimerRef.current) clearTimeout(callDurationTimerRef.current);
        if (finalDisconnectTimerRef.current) clearTimeout(finalDisconnectTimerRef.current);
        
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
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 200,
              create_response: true, // Important: tells server to respond after VAD detects end of user speech
              interrupt_response: true // Allows agent to be interrupted
            },
            // start_first_turn: true,
            // For MVP, no client-side tools are defined here. 
            // Tools would be: tools: currentAgent?.tools || [] from the example.
          },
        };
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
        console.error("Data channel error:", err);
        setSessionStatus("ERROR");
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
    console.log("Disconnect function called.");
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      pcRef.current.close();
      pcRef.current = null;
    }
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (audioElementRef.current && audioElementRef.current.srcObject) {
        const stream = audioElementRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        audioElementRef.current.srcObject = null;
    }

    setSessionStatus("DISCONNECTED");
    setIsAgentSpeaking(false);
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
    messageCountRef.current = 0; // Reset message count on disconnect
    messageLimitWarningPlayedRef.current = false; // Reset message warning flag
    setIsTransferInProgress(false); // Reset transfer in progress flag

    console.log("Disconnected.");
  }, []);
  
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

  const handleServerEvent = useCallback((eventString: string) => {
    let serverEvent;
    try {
      serverEvent = JSON.parse(eventString);
    } catch (error) {
      console.error("Failed to parse server event JSON:", error, "Event string:", eventString);
      return;
    }

    // console.log("Received server event:", serverEvent.type, serverEvent);

    switch (serverEvent.type) {
      case "session.created":
        // Session status is already set to CONNECTED when data channel opens.
        // Log session ID or other details if needed.
        console.log("Server confirmed session.created:", serverEvent.session?.id);
        // Potentially add a breadcrumb to transcript here if desired.
        break;

      case "output_audio_buffer.started":
        setIsAgentSpeaking(true);
        break;

      case "output_audio_buffer.stopped":
        setIsAgentSpeaking(false);
        // Check if this audio stop corresponds to the agent saying goodbye
        // TODO: this is a hack to ensure the disconnect sound is played when the agent says goodbye
        // and the client is waiting for the agent to finish speaking.
        // This should be fixed by the agent sending a specific event when it's done speaking.
        if (agentHasSaidGoodbyeRef.current) {
          console.log("REALTIME_HOOK: Agent finished speaking 'Goodbye!', playing disconnect sound and calling onAgentEndedCall.");
          playDisconnectAudio(); // Play disconnect sound
          onAgentEndedCall();
          agentHasSaidGoodbyeRef.current = false; // Reset the flag
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
        // If there was any accumulated delta, ensure it's finalized.
        // The example repo also processes function calls here, but we omit for MVP.
        const responseOutput = serverEvent.response?.output;
        if (responseOutput && Array.isArray(responseOutput)) {
            responseOutput.forEach((outputItem: any) => {
                if (outputItem.type === "message" && outputItem.role === "assistant" && outputItem.id) {
                    const finalAssistantText = outputItem.content?.[0]?.transcript || assistantMessageDeltasRef.current[outputItem.id] || "";
                     if (finalAssistantText) {
                        setInternalMessages(prevMessages => {
                            if (isTransferInProgress) return prevMessages; // Don't update messages if transfer started
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

                        // Check if agent ended the call
                        if (finalAssistantText.trim().toLowerCase().endsWith("goodbye!")) {
                          console.log("REALTIME_HOOK: Agent text includes Goodbye! Setting flag.");
                          agentHasSaidGoodbyeRef.current = true;
                        }
                    }
                    // Clear accumulated delta for this item_id as it's now final
                    if (assistantMessageDeltasRef.current[outputItem.id]) {
                        delete assistantMessageDeltasRef.current[outputItem.id];
                    }
                }
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
        const { response } = serverEvent;
        if (response?.output?.length > 0) {
          for (const outputItem of response.output) {
            if (outputItem.type === "tool_calls" && outputItem.tool_calls?.length > 0) {
              console.log("REALTIME_HOOK: Received tool_calls:", JSON.stringify(outputItem.tool_calls));
              if (isTransferInProgress || sessionStatus === "DISCONNECTED") {
                console.warn("REALTIME_HOOK: Ignoring tool_calls because a transfer is already in progress or session is disconnected.");
                break; // Exit loop if transfer already started or disconnected
              }

              for (const toolCall of outputItem.tool_calls) {
                // Example tool name from injectTransferTools: `transfer_to_${downstreamAgent.name}`
                // Or the generic `transferToSupervisor` as per refactor plan earlier stages.
                if (toolCall.name?.startsWith("transfer_to_") || toolCall.name === "transferToSupervisor") {
                  setIsTransferInProgress(true); // Set flag to prevent race conditions
                  const toolCallId = toolCall.id;
                  let targetAgentName = "";
                  if (toolCall.name.startsWith("transfer_to_")) {
                    targetAgentName = toolCall.name.substring("transfer_to_".length);
                  }
                  // If it's the generic 'transferToSupervisor', the client will decide which supervisor config to use.
                  // For now, if `targetAgentName` is empty, `onAgentTransferRequested` might need to infer it.
                  // However, our injectTransferTools should always generate specific names like `transfer_to_agent_supervisor`.

                  console.log(`REALTIME_HOOK: Handling tool call: ${toolCall.name}, ID: ${toolCallId}, Target: ${targetAgentName}`);
                  let parsedArgs = { reason: "N/A", conversation_summary: "N/A" };
                  try {
                    if (toolCall.args) {
                      parsedArgs = JSON.parse(toolCall.args);
                    }
                  } catch (e) {
                    console.error("REALTIME_HOOK: Failed to parse tool call arguments:", e);
                  }
                  console.log("REALTIME_HOOK: Parsed arguments:", parsedArgs);

                  // Acknowledge the tool call to the server
                  // The example sends response.update with tool_responses
                  const toolResponseEvent = {
                    type: "response.update", // OpenAI example uses this
                    response: {
                        tool_responses: [{
                            tool_call_id: toolCallId,
                            // Result is a stringified JSON object as per OpenAI examples
                            result: JSON.stringify({ status: "Transfer initiated.", detail: `Transferring to ${targetAgentName || 'supervisor'}` })
                        }]
                    }
                  };
                  sendClientEvent(toolResponseEvent, "tool_call_response");
                  
                  // Log user-facing message (optional, can be handled by client component)
                  const transferMsgId = `system-transfer-${Date.now()}`;
                  const transferText = `[System: Transferring to ${targetAgentName || 'supervisor'}${parsedArgs.reason !== "N/A" ? ` (Reason: ${parsedArgs.reason})` : ''}...]`;
                  setInternalMessages(prev => [...prev, {id: transferMsgId, role: 'user', text: transferText}]);

                  // Disconnect current agent
                  console.log("REALTIME_HOOK: Disconnecting current agent for transfer.");
                  disconnect(); // This will also reset isTransferInProgress

                  // Notify the client (BillNegotiatorClient) to handle the agent switch and reconnect
                  if (onAgentTransferRequested) {
                    console.log("REALTIME_HOOK: Calling onAgentTransferRequested for target:", targetAgentName);
                    onAgentTransferRequested(targetAgentName, parsedArgs);
                  } else {
                    console.warn("REALTIME_HOOK: onAgentTransferRequested callback is not provided.");
                  }
                  // Important: Break after handling the first transfer tool call to avoid processing others in the same batch
                  // if multiple were somehow sent (though typically it's one logical transfer).
                  break;
                }
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
  }, [setInternalMessages, setIsAgentSpeaking, onUserTranscriptCompleted, onAgentEndedCall, currentAgentConfig, disconnect, onAgentTransferRequested, sendClientEvent, isTransferInProgress]);

  return {
    connect,
    disconnect,
    sessionStatus,
    messages: internalMessages, // Expose internal messages
    isAgentSpeaking,
    // TODO: Expose other necessary functions like sending user audio/text
    // Add a way to get the current message count or duration if needed by UI
    // TODO: Consider how to handle UI updates for warnings (e.g. visual timer)
  };
} 