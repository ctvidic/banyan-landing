"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Types (can be expanded later)
export type SessionStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED"
  | "ERROR";

// Re-using Message type from BillNegotiatorClient.tsx - ensure it's available or redefine/import
export type Message = { id: string; role: "user" | "Sarah" | "Marco"; text: string };

export type AgentRole = "agent_frontline" | "agent_supervisor";

interface UseRealtimeNegotiationProps {
  onMessagesUpdate: (messages: Message[]) => void;
  onAgentSpeakingChange: (isSpeaking: boolean) => void;
  onSessionStatusChange: (status: SessionStatus) => void;
  currentAgentRole: AgentRole;
  onUserTranscriptCompleted: (transcript: string) => void;
  onAgentEndedCall: () => void;
}

export function useRealtimeNegotiation({
  onMessagesUpdate,
  onAgentSpeakingChange,
  onSessionStatusChange,
  currentAgentRole,
  onUserTranscriptCompleted,
  onAgentEndedCall,
}: UseRealtimeNegotiationProps) {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED");
  const [internalMessages, setInternalMessages] = useState<Message[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const ephemeralKeyRef = useRef<string | null>(null);
  const assistantMessageDeltasRef = useRef<{ [itemId: string]: string }>({}); // To accumulate deltas
  const agentHasSaidGoodbyeRef = useRef<boolean>(false); // Added this ref

  const agentNameMap: Record<AgentRole, "Sarah" | "Marco"> = {
    agent_frontline: "Sarah",
    agent_supervisor: "Marco",
  };

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
    console.log("REALTIME_HOOK: connect invoked. currentAgentRole prop:", currentAgentRole);
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

        // Send initial session.update to configure the agent (Phase 2, Step 7)
        const agentInstructions = currentAgentRole === "agent_frontline" 
          ? "You are Sarah, an Indian woman call-centre rep with an Indian woman accent, friendly. You speak in ENGLISH ONLY. Your primary goal is to assist the user with their billing issue. START by greeting the user and asking for their name to begin the conversation. You DO NOT need additional account information, a name is enough. Then, understand their issue (internet bill jumped from $69 to $89 after a 12-month promo expired) and explain the promo. Guide them towards one of these resolutions: admitting it was a promo price, accepting a slightly (but not fully) reduced price due to loyalty, or escalating to a supervisor if the user explicitly asks for one. HOWEVER, if the user explicitly requests to speak to a supervisor, and the system is preparing to transfer them, your VERY NEXT and FINAL response before the transfer MUST BE an acknowledgment. Examples: 'Okay, I'll transfer you to my supervisor now. One moment, please.' OR 'Certainly, I'm connecting you to my supervisor. Please hold.' After giving this specific acknowledgment, you will say nothing further as the transfer will then occur. Do not attempt to resolve the issue further yourself if a supervisor request has been made and a transfer is imminent. Keep things courteous, concise and guide toward resolution. DO NOT take long pauses. When the conversation is definitively over and you have provided all necessary information or resolution, end your final message with 'Goodbye!' DO NOT end with 'Goodbye!' if you are connecting to a supervisor."
          : "You are Marco, a Filipino male supervisor, authoritative with a Filipino man accent. You speak in ENGLISH ONLY. You are taking over an escalated call. Your goal is to help the user reach a resolution. START by acknowledging the escalation and understanding the current situation from the user. You DO NOT need additional account information, a name is enough. Then, work to find one of these outcomes: full discount, partial discount, added features, or downgrading their plan. DO NOT take long pauses. DO NOT present options unless the user asks about them. You MUST give the bill amount as a final dollar amount and NOT as some % off or dollar amount off. Close the call once resolved. When the conversation is definitively over and you have provided all necessary information or resolution, end you MUST end your final message with 'Goodbye!'"
        
        const agentVoice = currentAgentRole === "agent_frontline" ? "coral" : "sage"; // As per original BillNegotiatorClient
        console.log("REALTIME_HOOK: Configuring agent for role:", currentAgentRole, "Voice:", agentVoice, "Instructions:", agentInstructions);

        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: agentInstructions,
            voice: agentVoice,
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
  }, [sessionStatus, fetchEphemeralKey, currentAgentRole, onUserTranscriptCompleted, onAgentEndedCall]);

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
        if (agentHasSaidGoodbyeRef.current) {
          console.log("REALTIME_HOOK: Agent finished speaking 'Goodbye!', calling onAgentEndedCall.");
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
              // Determine display role: 'user' or specific agent name
              const displayRole = item.role === "user" ? "user" : agentNameMap[currentAgentRole];
              return [...prevMessages, { id: item.id, role: displayRole, text: item.content[0].text }];
            }
            return prevMessages;
          });
        } else if (item?.id && item.role === "user" && item.content?.[0]?.type === "input_audio"){
            // User audio input started, show [Transcribing...]
             setInternalMessages(prevMessages => {
                if (!prevMessages.find(msg => msg.id === item.id)) {
                    return [...prevMessages, { id: item.id, role: "user", text: "[Transcribing...]" }];
                }
                return prevMessages;
            });
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
              // Role is already set, just update text
              updatedMessages[existingMsgIndex] = { ...updatedMessages[existingMsgIndex], text: finalText };
              return updatedMessages;
            } else {
              // Agent started speaking, create a new message item
              const agentName = agentNameMap[currentAgentRole];
              return [...prevMessages, { id: item_id, role: agentName, text: finalText }];
            }
          });
          if (onUserTranscriptCompleted) {
            console.log("REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with:", finalText);
            onUserTranscriptCompleted(finalText);
          }
        }
        break;
      }

      case "response.audio_transcript.delta": {
        const { item_id, delta } = serverEvent;
        if (item_id && delta) {
          if (!assistantMessageDeltasRef.current[item_id]) {
            assistantMessageDeltasRef.current[item_id] = "";
          }
          assistantMessageDeltasRef.current[item_id] += delta;
          const fullText = assistantMessageDeltasRef.current[item_id];

          setInternalMessages(prevMessages => {
            const existingMsgIndex = prevMessages.findIndex(msg => msg.id === item_id);
            if (existingMsgIndex !== -1) {
              const updatedMessages = [...prevMessages];
              updatedMessages[existingMsgIndex] = { ...updatedMessages[existingMsgIndex], text: fullText };
              return updatedMessages;
            } else {
              // Agent started speaking, create a new message item
              const agentName = agentNameMap[currentAgentRole];
              return [...prevMessages, { id: item_id, role: agentName, text: fullText }];
            }
          });
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
                            const existingMsgIndex = prevMessages.findIndex(msg => msg.id === outputItem.id);
                            if (existingMsgIndex !== -1) {
                                const updatedMessages = [...prevMessages];
                                // Role is already set, just update text
                                updatedMessages[existingMsgIndex] = { ...updatedMessages[existingMsgIndex], text: finalAssistantText };
                                return updatedMessages;
                            } else {
                                // Should have been created by delta, but as a fallback:
                                const agentName = agentNameMap[currentAgentRole];
                                return [...prevMessages, { id: outputItem.id, role: agentName, text: finalAssistantText }];
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
        // Any other finalization logic for response.done for MVP?
        console.log("Server response.done event received.");
        break;
      }

      default:
        // console.log("Unhandled server event type:", serverEvent.type);
        break;
    }
  }, [setInternalMessages, setIsAgentSpeaking, onUserTranscriptCompleted, onAgentEndedCall, currentAgentRole]);

  return {
    connect,
    disconnect,
    sessionStatus,
    messages: internalMessages, // Expose internal messages
    isAgentSpeaking,
    // TODO: Expose other necessary functions like sending user audio/text
  };
} 