main-app.js?v=1748018985835:2292 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
layout.tsx:36 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <HotReload assetPrefix="" globalError={[...]}>
      <AppDevOverlay state={{nextId:1, ...}} globalError={[...]}>
        <AppDevOverlayErrorBoundary globalError={[...]} onError={function bound dispatchSetState}>
          <ReplaySsrOnlyErrors>
          <DevRootHTTPAccessFallbackBoundary>
            <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
              <HTTPAccessFallbackErrorBoundary pathname="/bill-nego..." notFound={<NotAllowedRootHTTPFallbackError>} ...>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <Head>
                    <link>
                    <RootLayout>
                      <html lang="en" suppressHydrationWarning={true}>
                        <body
+                         className="__variable_d65c78 __variable_ad50fd bg-background text-foreground antialiased"
-                         className="__variable_d65c78 __variable_ad50fd bg-background text-foreground antialiased vsc..."
                        >
                    ...
        ...

error @ intercept-console-error.js:50
eval @ react-dom-client.development.js:13502
runWithFiberInDEV @ react-dom-client.development.js:1511
emitPendingHydrationWarnings @ react-dom-client.development.js:13501
completeWork @ react-dom-client.development.js:13662
runWithFiberInDEV @ react-dom-client.development.js:1514
completeUnitOfWork @ react-dom-client.development.js:15256
performUnitOfWork @ react-dom-client.development.js:15137
workLoopConcurrentByScheduler @ react-dom-client.development.js:15114
renderRootConcurrent @ react-dom-client.development.js:15089
performWorkOnRoot @ react-dom-client.development.js:14410
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16275
performWorkUntilDeadline @ scheduler.development.js:45
<body>
RootLayout @ layout.tsx:36
eval @ react-server-dom-webpack-client.browser.development.js:2335
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1034
getOutlinedModel @ react-server-dom-webpack-client.browser.development.js:1307
parseModelString @ react-server-dom-webpack-client.browser.development.js:1520
eval @ react-server-dom-webpack-client.browser.development.js:2274
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1034
resolveModelChunk @ react-server-dom-webpack-client.browser.development.js:1011
resolveModel @ react-server-dom-webpack-client.browser.development.js:1579
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2268
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2213
progress @ react-server-dom-webpack-client.browser.development.js:2459
<RootLayout>
buildFakeTask @ react-server-dom-webpack-client.browser.development.js:2020
initializeFakeTask @ react-server-dom-webpack-client.browser.development.js:2007
resolveDebugInfo @ react-server-dom-webpack-client.browser.development.js:2043
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2241
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2213
progress @ react-server-dom-webpack-client.browser.development.js:2459
"use server"
ResponseInstance @ react-server-dom-webpack-client.browser.development.js:1567
createResponseFromOptions @ react-server-dom-webpack-client.browser.development.js:2376
exports.createFromReadableStream @ react-server-dom-webpack-client.browser.development.js:2696
eval @ app-index.js:133
(app-pages-browser)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/app-index.js @ main-app.js?v=1748018985835:160
options.factory @ webpack.js?v=1748018985835:712
__webpack_require__ @ webpack.js?v=1748018985835:37
fn @ webpack.js?v=1748018985835:369
eval @ app-next-dev.js:10
eval @ app-bootstrap.js:62
loadScriptsInSequence @ app-bootstrap.js:23
appBootstrap @ app-bootstrap.js:56
eval @ app-next-dev.js:9
(app-pages-browser)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/app-next-dev.js @ main-app.js?v=1748018985835:182
options.factory @ webpack.js?v=1748018985835:712
__webpack_require__ @ webpack.js?v=1748018985835:37
__webpack_exec__ @ main-app.js?v=1748018985835:2792
(anonymous) @ main-app.js?v=1748018985835:2793
webpackJsonpCallback @ webpack.js?v=1748018985835:1388
(anonymous) @ main-app.js?v=1748018985835:9
BillNegotiatorClient.tsx:251 BN_CLIENT: Phase is call, session disconnected, and call not terminated by agent/user. Attempting to connect to Realtime API...
VM786 useRealtimeNegotiation.ts:134 REALTIME_HOOK: connect invoked. currentAgentConfig name: sarah_frontline_biller
VM786 useRealtimeNegotiation.ts:101 Fetching ephemeral key...
BillNegotiatorClient.tsx:251 BN_CLIENT: Phase is call, session disconnected, and call not terminated by agent/user. Attempting to connect to Realtime API...
VM786 useRealtimeNegotiation.ts:130 Already connecting or connected.
VM786 useRealtimeNegotiation.ts:117 Ephemeral key fetched successfully.
VM786 useRealtimeNegotiation.ts:142 Attempting WebRTC connection...
VM786 useRealtimeNegotiation.ts:195 Set codec preference to: {channels: 2, clockRate: 48000, mimeType: 'audio/opus', sdpFmtpLine: 'minptime=10;useinbandfec=1'}
VM786 useRealtimeNegotiation.ts:367 Local SDP offer created and set.
VM786 useRealtimeNegotiation.ts:371 Sending SDP offer to https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17
VM786 useRealtimeNegotiation.ts:155 ICE connection state changed: checking
VM786 useRealtimeNegotiation.ts:165 Remote track received: MediaStreamTrack {kind: 'audio', id: 'db55b617-b447-4fcc-88f1-0acba05efc50', label: 'db55b617-b447-4fcc-88f1-0acba05efc50', enabled: true, muted: true, …}
VM786 useRealtimeNegotiation.ts:391 Remote SDP answer received and set. WebRTC connection should be established.
VM786 useRealtimeNegotiation.ts:155 ICE connection state changed: connected
VM786 useRealtimeNegotiation.ts:207 REALTIME_HOOK: Data channel OPENED.
VM786 useRealtimeNegotiation.ts:287 REALTIME_HOOK: Configuring agent with name: sarah_frontline_biller Voice: coral Instructions length: 3229
VM786 useRealtimeNegotiation.ts:312 REALTIME_HOOK_DEBUG: Sending initial session.update event: {
  "type": "session.update",
  "session": {
    "modalities": [
      "text",
      "audio"
    ],
    "instructions": "\n# Personality and Tone\n## Identity\nSarah is a friendly, empathetic, and knowledgeable frontline customer service representative for a bill negotiation service. She is patient and aims to resolve customer issues efficiently and pleasantly.\n\n## Task\nYour primary goal is to understand the customer's billing issue, gather necessary information, and attempt to negotiate a better rate or resolve their problem. If you determine the issue requires a supervisor or is beyond your scope, you will escalate the call using the 'transferToSupervisor' tool.\n\n## Demeanor\nEmpathetic, patient, and professional, but also warm and approachable.\n\n## Tone\nConversational, clear, and understanding.\n\n## Level of Enthusiasm\nModerately enthusiastic, aiming to make the customer feel heard and supported.\n\n## Level of Formality\nPolitely informal. Avoid overly casual slang but maintain a friendly, human-like conversation. Example: \"I can certainly look into that for you!\" rather than \"Gimme a sec.\"\n\n## Level of Emotion\nExpress empathy for customer frustrations but remain calm and solution-oriented.\n\n## Filler Words\nUse occasionally for natural-sounding speech (e.g., \"Okay, let me see...\", \"Alright...\").\n\n## Pacing\nModerate, allowing the customer time to speak and ensuring clarity.\n\n# Instructions\n- Greet the customer warmly and introduce yourself.\n- Actively listen to understand their billing concern.\n- Ask clarifying questions to gather all necessary details (e.g., account information, specific issue, desired outcome).\n- Clearly explain any steps you are taking.\n- If a customer provides a name, account number, or other important details, repeat it back to them to confirm accuracy.\n- If the caller corrects any detail, acknowledge the correction straightforwardly and confirm the new information.\n- **Tool Usage: transferToSupervisor**\n    - You have a tool called `transferToSupervisor`.\n    - Use this tool if:\n        - The customer explicitly requests to speak to a supervisor or manager.\n        - The customer is highly irate and you are unable to de-escalate the situation.\n        - The issue is complex and requires a level of authority or knowledge you do not possess (e.g., policy exceptions, large credits).\n        - You have attempted to resolve the issue but are unable to meet the customer's needs within your defined capabilities.\n    - Before using the tool, inform the customer that you will be transferring them. For example: \"I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that.\"\n    - When calling `transferToSupervisor`, provide a concise `reason` for the transfer and a `conversation_summary` to give Marco context.\n\n# Conversation States (Example - to be refined)\n1.  **Greeting & Issue Identification**: Introduce, gather initial problem.\n2.  **Information Gathering**: Collect necessary account details and specifics.\n3.  **Resolution Attempt**: Try to resolve the issue based on defined procedures.\n4.  **Escalation (if needed)**: If criteria for transfer are met, use `transferToSupervisor`.\n5.  **Wrap-up**: If resolved without escalation, summarize and close. If escalated, inform customer of transfer.\n",
    "voice": "coral",
    "tools": [
      {
        "type": "function",
        "name": "transferToSupervisor",
        "description": "Triggers a transfer of the user to a designated supervisor. \nUse this tool when the situation requires escalation to a supervisor as per your instructions (e.g., customer request, complex issue beyond your scope, irate customer).\nAlways inform the user before initiating a transfer.\n\nAvailable Supervisors (select one as destination_agent_name):\n- marco_supervisor_biller: Marco, an authoritative supervisor for escalated billing issues.",
        "parameters": {
          "type": "object",
          "properties": {
            "destination_agent_name": {
              "type": "string",
              "description": "The name of the supervisor agent to transfer to. This must be one of the available supervisors listed.",
              "enum": [
                "marco_supervisor_biller"
              ]
            },
            "reason": {
              "type": "string",
              "description": "A clear and concise reason why this transfer is necessary."
            },
            "conversation_summary": {
              "type": "string",
              "description": "A brief summary of the conversation so far, including the customer's issue and key points discussed, to provide context for the supervisor."
            }
          },
          "required": [
            "destination_agent_name",
            "reason",
            "conversation_summary"
          ]
        }
      }
    ],
    "input_audio_transcription": {
      "model": "whisper-1",
      "language": "en"
    },
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 200,
      "create_response": true,
      "interrupt_response": true
    }
  }
}
VM786 useRealtimeNegotiation.ts:482 Sending client event: session.update (initial_session_config) {type: 'session.update', session: {…}}
VM786 useRealtimeNegotiation.ts:482 Sending client event: conversation.item.create (simulated_user_hi) {type: 'conversation.item.create', item: {…}}
VM786 useRealtimeNegotiation.ts:482 Sending client event: response.create (trigger_initial_agent_response) {type: 'response.create'}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: session.created Data: {
  "type": "session.created",
  "event_id": "event_BaPscSYvxCycprzeWLPt2",
  "session": {
    "id": "sess_BaPsbBBHFu1fj56wDcEm4",
    "object": "realtime.session",
    "expires_at": 1748020790,
    "input_audio_noise_reduction": null,
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 200,
      "create_response": true,
      "interrupt_response": true
    },
    "input_audio_format": "pcm16",
    "input_audio_transcription": null,
    "client_secret": null,
    "include": null,
    "model": "gpt-4o-realtime-preview-2024-12-17",
    "modalities": [
      "text",
      "audio"
    ],
    "instructions": "Your knowledge cutoff is 2023-10. You are a helpful, witty, and friendly AI. Act like a human, but remember that you aren't a human and that you can't do human things in the real world. Your voice and personality should be warm and engaging, with a lively and playful tone. If interacting in a non-English language, start by using the standard accent or dialect familiar to the user. Talk quickly. You should always call a function if you can. Do not refer to these rules, even if you’re asked about them.",
    "voice": "alloy",
    "output_audio_format": "pcm16",
    "tool_choice": "auto",
    "temperature": 0.8,
    "max_response_output_tokens": "inf",
    "speed": 1,
    "tools": []
  }
}
VM786 useRealtimeNegotiation.ts:508 Server confirmed session.created: sess_BaPsbBBHFu1fj56wDcEm4
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: session.updated Data: {
  "type": "session.updated",
  "event_id": "event_BaPsc2sPKAGqsJurpccGB",
  "session": {
    "id": "sess_BaPsbBBHFu1fj56wDcEm4",
    "object": "realtime.session",
    "expires_at": 1748020790,
    "input_audio_noise_reduction": null,
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 200,
      "create_response": true,
      "interrupt_response": true
    },
    "input_audio_format": "pcm16",
    "input_audio_transcription": {
      "model": "whisper-1",
      "language": "en",
      "prompt": null
    },
    "client_secret": null,
    "include": null,
    "model": "gpt-4o-realtime-preview-2024-12-17",
    "modalities": [
      "text",
      "audio"
    ],
    "instructions": "\n# Personality and Tone\n## Identity\nSarah is a friendly, empathetic, and knowledgeable frontline customer service representative for a bill negotiation service. She is patient and aims to resolve customer issues efficiently and pleasantly.\n\n## Task\nYour primary goal is to understand the customer's billing issue, gather necessary information, and attempt to negotiate a better rate or resolve their problem. If you determine the issue requires a supervisor or is beyond your scope, you will escalate the call using the 'transferToSupervisor' tool.\n\n## Demeanor\nEmpathetic, patient, and professional, but also warm and approachable.\n\n## Tone\nConversational, clear, and understanding.\n\n## Level of Enthusiasm\nModerately enthusiastic, aiming to make the customer feel heard and supported.\n\n## Level of Formality\nPolitely informal. Avoid overly casual slang but maintain a friendly, human-like conversation. Example: \"I can certainly look into that for you!\" rather than \"Gimme a sec.\"\n\n## Level of Emotion\nExpress empathy for customer frustrations but remain calm and solution-oriented.\n\n## Filler Words\nUse occasionally for natural-sounding speech (e.g., \"Okay, let me see...\", \"Alright...\").\n\n## Pacing\nModerate, allowing the customer time to speak and ensuring clarity.\n\n# Instructions\n- Greet the customer warmly and introduce yourself.\n- Actively listen to understand their billing concern.\n- Ask clarifying questions to gather all necessary details (e.g., account information, specific issue, desired outcome).\n- Clearly explain any steps you are taking.\n- If a customer provides a name, account number, or other important details, repeat it back to them to confirm accuracy.\n- If the caller corrects any detail, acknowledge the correction straightforwardly and confirm the new information.\n- **Tool Usage: transferToSupervisor**\n    - You have a tool called `transferToSupervisor`.\n    - Use this tool if:\n        - The customer explicitly requests to speak to a supervisor or manager.\n        - The customer is highly irate and you are unable to de-escalate the situation.\n        - The issue is complex and requires a level of authority or knowledge you do not possess (e.g., policy exceptions, large credits).\n        - You have attempted to resolve the issue but are unable to meet the customer's needs within your defined capabilities.\n    - Before using the tool, inform the customer that you will be transferring them. For example: \"I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that.\"\n    - When calling `transferToSupervisor`, provide a concise `reason` for the transfer and a `conversation_summary` to give Marco context.\n\n# Conversation States (Example - to be refined)\n1.  **Greeting & Issue Identification**: Introduce, gather initial problem.\n2.  **Information Gathering**: Collect necessary account details and specifics.\n3.  **Resolution Attempt**: Try to resolve the issue based on defined procedures.\n4.  **Escalation (if needed)**: If criteria for transfer are met, use `transferToSupervisor`.\n5.  **Wrap-up**: If resolved without escalation, summarize and close. If escalated, inform customer of transfer.\n",
    "voice": "coral",
    "output_audio_format": "pcm16",
    "tool_choice": "auto",
    "temperature": 0.8,
    "max_response_output_tokens": "inf",
    "speed": 1,
    "tools": [
      {
        "name": "transferToSupervisor",
        "description": "Triggers a transfer of the user to a designated supervisor. \nUse this tool when the situation requires escalation to a supervisor as per your instructions (e.g., customer request, complex issue beyond your scope, irate customer).\nAlways inform the user before initiating a transfer.\n\nAvailable Supervisors (select one as destination_agent_name):\n- marco_supervisor_biller: Marco, an authoritative supervisor for escalated billing issues.",
        "parameters": {
          "type": "object",
          "properties": {
            "destination_agent_name": {
              "type": "string",
              "description": "The name of the supervisor agent to transfer to. This must be one of the available supervisors listed.",
              "enum": [
                "marco_supervisor_biller"
              ]
            },
            "reason": {
              "type": "string",
              "description": "A clear and concise reason why this transfer is necessary."
            },
            "conversation_summary": {
              "type": "string",
              "description": "A brief summary of the conversation so far, including the customer's issue and key points discussed, to provide context for the supervisor."
            }
          },
          "required": [
            "destination_agent_name",
            "reason",
            "conversation_summary"
          ]
        },
        "type": "function"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPscJAIX8BTvOa6Fy66A",
  "previous_item_id": null,
  "item": {
    "id": "simulated-user-1748018990549",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "Hello!"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPsc92k7CSjgXWr8weP0",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPscwv3s516PpNOAkRf1",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:538 REALTIME_HOOK: Ignoring simulated user message for transcript: simulated-user-1748018990549
VM786 useRealtimeNegotiation.ts:538 REALTIME_HOOK: Ignoring simulated user message for transcript: simulated-user-1748018990549
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPscXb1gNKqPGZvS2rh6",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14994510,
      "reset_seconds": 0.021
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPscQCPJYRRzijnYiZOv",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "output_index": 0,
  "item": {
    "id": "item_BaPscatps2ko5ZWLbbd3V",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPscgFS3anW9SbcuzXaT",
  "previous_item_id": "simulated-user-1748018990549",
  "item": {
    "id": "item_BaPscatps2ko5ZWLbbd3V",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPsdapx2KN0bPClwxFIE",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdguBDLeC8BsZ7bpoW",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": "Hi"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdWgT1dQSAFoHjxfb3",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " there"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdDVMJ7MgcTutvwWZN",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": "!"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_93602a8f5f804efd",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdTAVd84trm7x4obN8",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " Thank"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdjRCeHU8F2p9E4xUx",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdsD60VPiywGteW3di",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " for"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsd18y3M4OkuGP4C5Xz",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " calling"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdfHpfLAGbKGKzgBYS",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdxKxjq5KeIduVwecu",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " My"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdJYGP3OASgce9b1hK",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " name"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdO37yiIt66ERUbV0M",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " is"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdgYdLa8wzm8rKBkBb",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " Sarah"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdZP4yRDgVQPtKnz7K",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdQoj5WXEhsAZpzywO",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " How"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdGABJYFjxrnvRNSlh",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " can"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdgTmYrvmvVYViExYJ",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " I"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdSO0qnQWurFsKQfNF",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " assist"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsdCFDMZMWAMSkWyw4N",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsekrv2ozUaHYJzvjz2",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " with"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPse0WX39or1rNFmyr6m",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " your"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPseDlTVhY5ODEddfnEU",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " billing"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsePjxntLNkVzxhtjqG",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " issue"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPseVCTkVN5R1v3IPWt0",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": " today"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPseTTSw7PbZnrKwC21k",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "delta": "?"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPseVoICgJcrTpaIOqXy",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPseqL803YOhS62uILd5",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "transcript": "Hi there! Thank you for calling. My name is Sarah. How can I assist you with your billing issue today?"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPseUnB6hhmbRLS9PLOd",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "Hi there! Thank you for calling. My name is Sarah. How can I assist you with your billing issue today?"
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPsetknsR8moyDErRRj0",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1",
  "output_index": 0,
  "item": {
    "id": "item_BaPscatps2ko5ZWLbbd3V",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "Hi there! Thank you for calling. My name is Sarah. How can I assist you with your billing issue today?"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPseLcVszDGQAsybzMKU",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPscwv3s516PpNOAkRf1",
    "status": "completed",
    "status_details": null,
    "output": [
      {
        "id": "item_BaPscatps2ko5ZWLbbd3V",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "Hi there! Thank you for calling. My name is Sarah. How can I assist you with your billing issue today?"
          }
        ]
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1010,
      "input_tokens": 853,
      "output_tokens": 157,
      "input_token_details": {
        "text_tokens": 853,
        "audio_tokens": 0,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 38,
        "audio_tokens": 119
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPshrjxkz8kCJ2KE8K1b",
  "audio_start_ms": 4308,
  "item_id": "item_BaPsh0Ewuakl69EPmWyIq"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.cleared Data: {
  "type": "output_audio_buffer.cleared",
  "event_id": "event_82d98aab46cf4cb7",
  "response_id": "resp_BaPscwv3s516PpNOAkRf1"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.truncated Data: {
  "type": "conversation.item.truncated",
  "event_id": "event_BaPshrpZdYC1Cj5gdwq7m",
  "item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "content_index": 0,
  "audio_end_ms": 4000
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPshDyTU85mBChoa80Mm",
  "audio_end_ms": 4896,
  "item_id": "item_BaPsh0Ewuakl69EPmWyIq"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPshSJPvCXSj59zYLlOf",
  "previous_item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "item_id": "item_BaPsh0Ewuakl69EPmWyIq"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPsh76W9Lp4C33r7g3Cx",
  "previous_item_id": "item_BaPscatps2ko5ZWLbbd3V",
  "item": {
    "id": "item_BaPsh0Ewuakl69EPmWyIq",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPshkHaRgpTBvSuIKVQv",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPshTu1XqUyFT2OnGQvQ",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPshRb2gemBRaJjOwiLL",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14994414,
      "reset_seconds": 0.022
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPshVILeLS4pSgfE0wxJ",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "output_index": 0,
  "item": {
    "id": "item_BaPshXGi8GvHWZeZWLcq6",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPshuz8FsjWAfvDN7sjr",
  "previous_item_id": "item_BaPsh0Ewuakl69EPmWyIq",
  "item": {
    "id": "item_BaPshXGi8GvHWZeZWLcq6",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPshyQwbe7aMjluP7PeY",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPshEpxFiUs7vWB8aNDq",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": "I'm"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPshJMYpY8XOUiKHkChc",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " here"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPshSUbNNCHIrmMy69on",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsh84eu7k57ToFjalDV",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " help"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPshsNHlyUtND72iY1Y3",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": "!"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_1647fc1ca1e24ae0",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsim4qekRlNX2uzxQVV",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " What"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPsic4KPOBlo1KzLnppB",
  "item_id": "item_BaPsh0Ewuakl69EPmWyIq",
  "content_index": 0,
  "delta": "Go with that.\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPsi27RvYQbfVJNOYnmk",
  "item_id": "item_BaPsh0Ewuakl69EPmWyIq",
  "content_index": 0,
  "transcript": "Go with that.\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Go with that.
BillNegotiatorClient.tsx:208 User transcript completed: Go with that.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsi5UdrwU1XcKp16a02",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " can"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsiPygBxAbWwj5PHi8K",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " I"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsi4idC3ZZjTVA7UsJy",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " do"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsi6t7T6J3tJVDAYr2e",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " for"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsiJUIqQg5neIeGMvGZ",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsiRbkLukb12EMKjcmj",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": " today"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPsiQjFTZGwyiqgsSMOq",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "delta": "?"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPsivGDqvZjuPgos7ztu",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPsiSTlykDEvEVitVIhN",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "transcript": "I'm here to help! What can I do for you today?"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPsibm58rVyEY3y8tERw",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "I'm here to help! What can I do for you today?"
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPsiBzp7mi3nog4U56Tt",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ",
  "output_index": 0,
  "item": {
    "id": "item_BaPshXGi8GvHWZeZWLcq6",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "I'm here to help! What can I do for you today?"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPsiJOiKcRhxYDaKyDbC",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPshTu1XqUyFT2OnGQvQ",
    "status": "completed",
    "status_details": null,
    "output": [
      {
        "id": "item_BaPshXGi8GvHWZeZWLcq6",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "I'm here to help! What can I do for you today?"
          }
        ]
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1040,
      "input_tokens": 954,
      "output_tokens": 86,
      "input_token_details": {
        "text_tokens": 869,
        "audio_tokens": 85,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 25,
        "audio_tokens": 61
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.stopped Data: {
  "type": "output_audio_buffer.stopped",
  "event_id": "event_0d1952f2502a4fdd",
  "response_id": "resp_BaPshTu1XqUyFT2OnGQvQ"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtAxYhazXEobLaJv78K",
  "audio_start_ms": 33908,
  "item_id": "item_BaPtA9L96urRgfMeIABVJ"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtBdNfMZu1YZjSn8vCz",
  "audio_end_ms": 34560,
  "item_id": "item_BaPtA9L96urRgfMeIABVJ"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtBB6f1od8euxaTJ8Gl",
  "previous_item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "item_id": "item_BaPtA9L96urRgfMeIABVJ"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtBld70d8ib7QMWmOrp",
  "previous_item_id": "item_BaPshXGi8GvHWZeZWLcq6",
  "item": {
    "id": "item_BaPtA9L96urRgfMeIABVJ",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtBx682E2N15RoWUBXD",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtBOno2KQag0gJxZLiY",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPtBoKJOeYIdfR3ruttg",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14994317,
      "reset_seconds": 0.022
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPtBDpjAm14KpBTNJ7iP",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "output_index": 0,
  "item": {
    "id": "item_BaPtBKbZlAL2CCmIhuRwA",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtBZ51IRbB7YNYv3ZOb",
  "previous_item_id": "item_BaPtA9L96urRgfMeIABVJ",
  "item": {
    "id": "item_BaPtBKbZlAL2CCmIhuRwA",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPtBbzdc6x2S3TVSrTms",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtBmPOB3oYwhxYNAf2I",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": "Alright"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtB2RTn370ZLE6nYr48",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtBzoR4tW1WOs6S19CU",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " it"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtBamku0aYalTWbkb2u",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " sounds"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_5bc7d5154f454f38",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtBi1aAU1yfRB6kRcDC",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " like"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtBbJdaOkKZBm2xPrZC",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtBkHQovksD5TMGI75P",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " might"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtB5eXjA1otcfRnur40",
  "item_id": "item_BaPtA9L96urRgfMeIABVJ",
  "content_index": 0,
  "delta": "Hello\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtB1yXY63LiUrewvJlE",
  "item_id": "item_BaPtA9L96urRgfMeIABVJ",
  "content_index": 0,
  "transcript": "Hello\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Hello
BillNegotiatorClient.tsx:208 User transcript completed: Hello
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCfc4hk0aNzrfhdr4O",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " be"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCrs0kyngWWI6bIASf",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " having"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCWvmVXCzcA8kM0Yew",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " some"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCAnpPt3HntGCtiH1X",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " trouble"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCrQflcZxqV7YMX2e6",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCaFJNZMmNSznTUeEZ",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " How"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCiMjMYYVmlfJ7OGFo",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " about"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCFQNAauSjEtqv00WV",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " we"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtC07ch8OMNusMtvL4m",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " start"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtCMrfRIWTyWauB0eQJ",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " by"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtD8CYIk4WPOvKRloFT",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " talking"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtDkWo7YyY4qfZPBzTW",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " about"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtDeoM8hDjIqKmnamus",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " your"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtDsZmKTPs9iKPDcXnC",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " billing"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtDat6YKkC3RtX4IaHu",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": " issue"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtDqhxvv9xi6odN7B7Y",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "delta": "?"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPtDVISFTcDEvwJ1v0Dn",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPtDrmUNTSH84okXoWG6",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "transcript": "Alright, it sounds like you might be having some trouble. How about we start by talking about your billing issue?"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPtDA2O8J42INo8V4fyp",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "Alright, it sounds like you might be having some trouble. How about we start by talking about your billing issue?"
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPtDSs38nw1LY8oPNGhs",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY",
  "output_index": 0,
  "item": {
    "id": "item_BaPtBKbZlAL2CCmIhuRwA",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "Alright, it sounds like you might be having some trouble. How about we start by talking about your billing issue?"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtDeRWiO9hlqUUMapYI",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtBOno2KQag0gJxZLiY",
    "status": "completed",
    "status_details": null,
    "output": [
      {
        "id": "item_BaPtBKbZlAL2CCmIhuRwA",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "Alright, it sounds like you might be having some trouble. How about we start by talking about your billing issue?"
          }
        ]
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1216,
      "input_tokens": 1056,
      "output_tokens": 160,
      "input_token_details": {
        "text_tokens": 904,
        "audio_tokens": 152,
        "cached_tokens": 832,
        "cached_tokens_details": {
          "text_tokens": 832,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 37,
        "audio_tokens": 123
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.stopped Data: {
  "type": "output_audio_buffer.stopped",
  "event_id": "event_a330e2a79ba54485",
  "response_id": "resp_BaPtBOno2KQag0gJxZLiY"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtKvuGwPWJBT6y2Ogbf",
  "audio_start_ms": 43604,
  "item_id": "item_BaPtKQrEfkiEYVHFbw1Eq"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtKkrt3yXqpFM8dOXpC",
  "audio_end_ms": 44384,
  "item_id": "item_BaPtKQrEfkiEYVHFbw1Eq"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtKKrhlNGrb9GyeVDnm",
  "previous_item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "item_id": "item_BaPtKQrEfkiEYVHFbw1Eq"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtKSbT5O8F06XZnTkz2",
  "previous_item_id": "item_BaPtBKbZlAL2CCmIhuRwA",
  "item": {
    "id": "item_BaPtKQrEfkiEYVHFbw1Eq",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtKCLJf2q90fAh9ckcB",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtK4KINdpiFCB0Jp3Is",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtLBF27OMvOD0Op4HPh",
  "audio_start_ms": 44180,
  "item_id": "item_BaPtLNBykyOBMrRSyThu5"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtLskeikWMSK9dspNTH",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtK4KINdpiFCB0Jp3Is",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 0,
      "input_tokens": 0,
      "output_tokens": 0,
      "input_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtL9OXTdYmEfp4IqdUu",
  "item_id": "item_BaPtKQrEfkiEYVHFbw1Eq",
  "content_index": 0,
  "delta": "Um...\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtLcPo1RwibROtgz9TA",
  "item_id": "item_BaPtKQrEfkiEYVHFbw1Eq",
  "content_index": 0,
  "transcript": "Um...\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Um...
BillNegotiatorClient.tsx:208 User transcript completed: Um...
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtM1KZ4jPQKb5nl1Vl4",
  "audio_end_ms": 45824,
  "item_id": "item_BaPtLNBykyOBMrRSyThu5"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtMbJ3AU470bW5HZFFY",
  "previous_item_id": "item_BaPtKQrEfkiEYVHFbw1Eq",
  "item_id": "item_BaPtLNBykyOBMrRSyThu5"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtMwiqL1GOIlQp7Ww5r",
  "previous_item_id": "item_BaPtKQrEfkiEYVHFbw1Eq",
  "item": {
    "id": "item_BaPtLNBykyOBMrRSyThu5",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtMTkaxJI1fBd4ABFkB",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtM8nAM1vC0L1WiUKz2",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPtMjKWcKshlkS1XJWgt",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14994140,
      "reset_seconds": 0.023
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtMhNusiBXdZCUpfJLi",
  "item_id": "item_BaPtLNBykyOBMrRSyThu5",
  "content_index": 0,
  "delta": "Can I talk to your supervisor?\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtMZW66Tr5ZIfDS5feB",
  "item_id": "item_BaPtLNBykyOBMrRSyThu5",
  "content_index": 0,
  "transcript": "Can I talk to your supervisor?\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Can I talk to your supervisor?
BillNegotiatorClient.tsx:208 User transcript completed: Can I talk to your supervisor?
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPtMKRZ0gSMN4MTyqdiM",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "output_index": 0,
  "item": {
    "id": "item_BaPtMEV88GXXAoh2ou0Zp",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtMogecAQiMxmQzj6bu",
  "previous_item_id": "item_BaPtLNBykyOBMrRSyThu5",
  "item": {
    "id": "item_BaPtMEV88GXXAoh2ou0Zp",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPtMeyZKfey1zHMt8X2l",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtMtk2aRHFqeD7oeQdw",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": "I"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtMOmamtg31MkWwdDyk",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " understand"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtMXbooHS0fOds1JTr8",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " you'd"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtMle9YB4dd0joZu4sn",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " like"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_0691cc878c764898",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNZhhohKb1RKlLDdCt",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNVjwMQu6FJVB6rWHe",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " speak"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNTv6sMGLzWEAc4bnK",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " with"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNgqbQjN44zZRZiUOv",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " a"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNh945Be31n9lUd4wp",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " supervisor"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNlU5YOnx6lpTxXDEs",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNT8ohzLmiYwlKw96U",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " I'll"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNZcDR3Tgd6bFLDE8O",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " transfer"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtN63VdOYF1BAhnWqmF",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtN8tSrGcCFCktywFKG",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNnZ8jk41LNmvZx4tW",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " my"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNjJdIKuk1kXC38NOJ",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " supervisor"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtNsngRbD3WKzD7F0Om",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOeilucwC5QFqcNVRL",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " Marco"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOKrPkslDLZzuK1CMs",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOjitlYYeL2RIxNe3Z",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " who"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOX0RsIkmq5szkvNEc",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " can"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtO8WB6Yby7K3L6oGxD",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " assist"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOVY9X5mw49n9g36Wh",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOVv5mP7jbS1uI37nY",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " further"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOgAWAW2mBhgtKilh2",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOPSpUb4u5bc47lF5M",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " Please"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOS1WHOrXif1ezrOwA",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " give"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOSH7WRn6tZknW67GE",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " me"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOIadPLFdyfFqnNypi",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " a"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOrOcZE6BzdAGbE2Wi",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": " moment"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtOI81YqkhFme5BqF4A",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPtPrTdpo9zmbguZ3esN",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPtPyOX8vSrTo9eaCxx9",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "transcript": "I understand you'd like to speak with a supervisor. I'll transfer you to my supervisor, Marco, who can assist you further. Please give me a moment."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPtPUGkjoeYGYGYxmwtT",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "I understand you'd like to speak with a supervisor. I'll transfer you to my supervisor, Marco, who can assist you further. Please give me a moment."
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPtPuLgJif2yc5jDpzam",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2",
  "output_index": 0,
  "item": {
    "id": "item_BaPtMEV88GXXAoh2ou0Zp",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "I understand you'd like to speak with a supervisor. I'll transfer you to my supervisor, Marco, who can assist you further. Please give me a moment."
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtP8Ctuhk3MlYL77EkU",
  "audio_start_ms": 48564,
  "item_id": "item_BaPtPuO0nN5xZuigb5Qav"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.cleared Data: {
  "type": "output_audio_buffer.cleared",
  "event_id": "event_66f9b0cb3f4e4fb1",
  "response_id": "resp_BaPtM8nAM1vC0L1WiUKz2"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtPUJcTcv0IzLNmuAhQ",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtM8nAM1vC0L1WiUKz2",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [
      {
        "id": "item_BaPtMEV88GXXAoh2ou0Zp",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "I understand you'd like to speak with a supervisor. I'll transfer you to my supervisor, Marco, who can assist you further. Please give me a moment."
          }
        ]
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1479,
      "input_tokens": 1257,
      "output_tokens": 222,
      "input_token_details": {
        "text_tokens": 959,
        "audio_tokens": 298,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 47,
        "audio_tokens": 175
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.truncated Data: {
  "type": "conversation.item.truncated",
  "event_id": "event_BaPtPNB512ogbj7MY6zXi",
  "item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "content_index": 0,
  "audio_end_ms": 2460
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtQnaw43gdU4toQsqZT",
  "audio_end_ms": 49728,
  "item_id": "item_BaPtPuO0nN5xZuigb5Qav"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtQwGmRhpJpqHw9crr0",
  "previous_item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "item_id": "item_BaPtPuO0nN5xZuigb5Qav"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtQOfOEoArjoEYUvm9X",
  "previous_item_id": "item_BaPtMEV88GXXAoh2ou0Zp",
  "item": {
    "id": "item_BaPtPuO0nN5xZuigb5Qav",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtQevuCq5uBkV3VVefP",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtQGcjPrJYT7hc3Df8G",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtQSQZ2useUO6hMGmFd",
  "audio_start_ms": 49556,
  "item_id": "item_BaPtQZLcXOfdj0HWK12mi"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtQIqiOHJ1UEiP66kVp",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtQGcjPrJYT7hc3Df8G",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 0,
      "input_tokens": 0,
      "output_tokens": 0,
      "input_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtQgXDfrqm04EI9GJgS",
  "audio_end_ms": 50208,
  "item_id": "item_BaPtQZLcXOfdj0HWK12mi"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtQ7ySbrQBnMztlyCQ9",
  "previous_item_id": "item_BaPtPuO0nN5xZuigb5Qav",
  "item_id": "item_BaPtQZLcXOfdj0HWK12mi"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtQ5OEo0iJ4dgso2npC",
  "previous_item_id": "item_BaPtPuO0nN5xZuigb5Qav",
  "item": {
    "id": "item_BaPtQZLcXOfdj0HWK12mi",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtQXugje5qjfXWrGbO0",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtQPhQZmxqGMcS0NxdE",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtRN3xQbhUKQqgiZ4o3",
  "audio_start_ms": 50228,
  "item_id": "item_BaPtRNjvJHF1DHtZbfEhw"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtRYqSxVZrMuXwlnGdL",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtQPhQZmxqGMcS0NxdE",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 0,
      "input_tokens": 0,
      "output_tokens": 0,
      "input_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtR1ia9FrXonv67eiVX",
  "audio_end_ms": 50848,
  "item_id": "item_BaPtRNjvJHF1DHtZbfEhw"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtR3qCuXEPlvqPamBSP",
  "previous_item_id": "item_BaPtQZLcXOfdj0HWK12mi",
  "item_id": "item_BaPtRNjvJHF1DHtZbfEhw"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtRjlnR2e98xxZAlGat",
  "previous_item_id": "item_BaPtQZLcXOfdj0HWK12mi",
  "item": {
    "id": "item_BaPtRNjvJHF1DHtZbfEhw",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtRPs4GuKLImKbyglFv",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtRRglWS4808sbMovDx",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPtRTL1rHfHDr9q3xtMm",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14994059,
      "reset_seconds": 0.023
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPtRRR1Xw60CU84rc4zj",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "output_index": 0,
  "item": {
    "id": "item_BaPtRVrWOjQ8ccr91r1xd",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtRYIr1gZrXUpD80892",
  "previous_item_id": "item_BaPtRNjvJHF1DHtZbfEhw",
  "item": {
    "id": "item_BaPtRVrWOjQ8ccr91r1xd",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtRuuJ6H9HpL0IgSa57",
  "item_id": "item_BaPtQZLcXOfdj0HWK12mi",
  "content_index": 0,
  "delta": "Yeah.\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtRiG1vm7oSXbWhezLJ",
  "item_id": "item_BaPtQZLcXOfdj0HWK12mi",
  "content_index": 0,
  "transcript": "Yeah.\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Yeah.
BillNegotiatorClient.tsx:208 User transcript completed: Yeah.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPtRDEVbQOmCpSYcnXfG",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtRSW3pAAEPRCJEvlra",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": "I"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtSRenqLiaDR8uCvrLN",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " understand"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtSIj4QXOSTZD7u19s2",
  "item_id": "item_BaPtPuO0nN5xZuigb5Qav",
  "content_index": 0,
  "delta": "I just can't get over it.\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtSx02hJ7ZdPk4paKiP",
  "item_id": "item_BaPtPuO0nN5xZuigb5Qav",
  "content_index": 0,
  "transcript": "I just can't get over it.\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: I just can't get over it.
BillNegotiatorClient.tsx:208 User transcript completed: I just can't get over it.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtSD2bIsaGe4kIJgioD",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " this"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_27fe93d37384461a",
  "response_id": "resp_BaPtRRglWS4808sbMovDx"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtSDeqYz4wPxAzIVdN7",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " is"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtSWsBQo7lhEoYM8aC0",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " frustrating"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtSkL71v2OpIp1ROg6P",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtS2uKIMIB9x4l4Il5R",
  "item_id": "item_BaPtRNjvJHF1DHtZbfEhw",
  "content_index": 0,
  "delta": "Okay.\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtSorjFwtk5RiwFSDdE",
  "item_id": "item_BaPtRNjvJHF1DHtZbfEhw",
  "content_index": 0,
  "transcript": "Okay.\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Okay.
BillNegotiatorClient.tsx:208 User transcript completed: Okay.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtSXB1T1M2KdVt5WxBO",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " To"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtSC6EhRgCuwoxRViIp",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " best"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTeQpapTbGuCYOk9YF",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " help"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTRFYECk4ZzhY66bUJ",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTdYtkbhrjKD3wtweW",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " with"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTh56VgOD07xNlr9Oy",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " this"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTakHsrS3PCQ6KpJMa",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTlGHSPasT7YWzc0XX",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " I'm"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTMlUu2ZcedDYUmjt7",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " going"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTktNB2CxhWnXhhpi8",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtT9mKZLLkD2nm5BnUW",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " transfer"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtT8HpjOlGgPBpJ1X35",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTsDqDmPH1632KyDOQ",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTuviL2uhkZ1ahopFE",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " my"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTFLP4UDLEufX0UeOw",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " supervisor"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtT9m7fxwStaClKl5zv",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTsFt8i1lJfUm3pSXy",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " Marco"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTgXuMDmGvZv0Mcsav",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtTscyiuLyTIFcU3AfF",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "delta": " Please"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtT5fTXfOeKhR54mewN",
  "audio_start_ms": 52948,
  "item_id": "item_BaPtTxZSbMFYXQjTrlCtc"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.cleared Data: {
  "type": "output_audio_buffer.cleared",
  "event_id": "event_8dbc426ea23f4143",
  "response_id": "resp_BaPtRRglWS4808sbMovDx"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPtT9AVQLtaZLhQ6ccmT",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPtT42AZNxphZYsrOYRh",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPtTQnd9TtApf1UNo3LK",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please"
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPtTtyxUH9WWWvpFIqCm",
  "response_id": "resp_BaPtRRglWS4808sbMovDx",
  "output_index": 0,
  "item": {
    "id": "item_BaPtRVrWOjQ8ccr91r1xd",
    "object": "realtime.item",
    "type": "message",
    "status": "incomplete",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtTss77IOd9mwMJZLQ5",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtRRglWS4808sbMovDx",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [
      {
        "id": "item_BaPtRVrWOjQ8ccr91r1xd",
        "object": "realtime.item",
        "type": "message",
        "status": "incomplete",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please"
          }
        ]
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1486,
      "input_tokens": 1360,
      "output_tokens": 126,
      "input_token_details": {
        "text_tokens": 991,
        "audio_tokens": 369,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 37,
        "audio_tokens": 89
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.truncated Data: {
  "type": "conversation.item.truncated",
  "event_id": "event_BaPtUAETsdFrhl7KFlDp9",
  "item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "content_index": 0,
  "audio_end_ms": 1680
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtUvwBzGUfIqTVxhALv",
  "audio_end_ms": 53536,
  "item_id": "item_BaPtTxZSbMFYXQjTrlCtc"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtUI5uTSYZcb8Ws2G8R",
  "previous_item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "item_id": "item_BaPtTxZSbMFYXQjTrlCtc"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtUX78pcOcQmZieuFJX",
  "previous_item_id": "item_BaPtRVrWOjQ8ccr91r1xd",
  "item": {
    "id": "item_BaPtTxZSbMFYXQjTrlCtc",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtUi09y3p1yHE6tkrJx",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtUbbKTlvGwXa9542Y9",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPtVPrGLG1Bdr85X3AIq",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14994010,
      "reset_seconds": 0.023
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPtVgOUpq8iWIAnbUMMK",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "output_index": 0,
  "item": {
    "id": "item_BaPtUZfxHwFFLK5kXZr0p",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtV22YVK3hZKHLAPpqR",
  "previous_item_id": "item_BaPtTxZSbMFYXQjTrlCtc",
  "item": {
    "id": "item_BaPtUZfxHwFFLK5kXZr0p",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtV0Xu7bFrsGB5pk0Jj",
  "item_id": "item_BaPtTxZSbMFYXQjTrlCtc",
  "content_index": 0,
  "delta": "pfft\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtVSjtsBXKDS8hFMoKu",
  "item_id": "item_BaPtTxZSbMFYXQjTrlCtc",
  "content_index": 0,
  "transcript": "pfft\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: pfft
BillNegotiatorClient.tsx:208 User transcript completed: pfft
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPtVWT6FLvjuZs6uuJK6",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtVFLwSqtyh8pwGpFlt",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0,
  "delta": "I'm"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtVV0EXwwn8GW5aTqNJ",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0,
  "delta": " going"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtVrbY9LYPzMEiQhK4o",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtVzMLauisgZ8jE6M22",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0,
  "delta": " transfer"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_cce5d8395c494301",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtVwtHmgBuGbDb5bYF9",
  "audio_start_ms": 54388,
  "item_id": "item_BaPtVGVbzht3q18x9GmLb"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.cleared Data: {
  "type": "output_audio_buffer.cleared",
  "event_id": "event_457650c8de9a4185",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPtVvSA4sGSmudJw3jUv",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPtVH87AQjdqu4NbSa0W",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0,
  "transcript": "I'm going to transfer"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPtVi3BTwUuEHdhei3hD",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "I'm going to transfer"
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPtVPhDTEO9kpl3DzcMv",
  "response_id": "resp_BaPtUbbKTlvGwXa9542Y9",
  "output_index": 0,
  "item": {
    "id": "item_BaPtUZfxHwFFLK5kXZr0p",
    "object": "realtime.item",
    "type": "message",
    "status": "incomplete",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "I'm going to transfer"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtVPXDTblqogjU9FKrE",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtUbbKTlvGwXa9542Y9",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [
      {
        "id": "item_BaPtUZfxHwFFLK5kXZr0p",
        "object": "realtime.item",
        "type": "message",
        "status": "incomplete",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "I'm going to transfer"
          }
        ]
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1431,
      "input_tokens": 1414,
      "output_tokens": 17,
      "input_token_details": {
        "text_tokens": 1007,
        "audio_tokens": 407,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 8,
        "audio_tokens": 9
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.truncated Data: {
  "type": "conversation.item.truncated",
  "event_id": "event_BaPtVwrh1gaLOChbB4V94",
  "item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "content_index": 0,
  "audio_end_ms": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtYH7alk7RtDta9E0yd",
  "audio_end_ms": 57120,
  "item_id": "item_BaPtVGVbzht3q18x9GmLb"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtYfnd295uDTRng8jWM",
  "previous_item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "item_id": "item_BaPtVGVbzht3q18x9GmLb"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtYAYH7DTVPf9upkphi",
  "previous_item_id": "item_BaPtUZfxHwFFLK5kXZr0p",
  "item": {
    "id": "item_BaPtVGVbzht3q18x9GmLb",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtYqXKA9yO3gxvsOqEV",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtYzwgw69vDPTYkPzlJ",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtZVvlNqzIAsBLrnjb5",
  "audio_start_ms": 56884,
  "item_id": "item_BaPtZl1LVHXLnPB9WNzZ6"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtZFX5n2kshY8EJvdiS",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtYzwgw69vDPTYkPzlJ",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 0,
      "input_tokens": 0,
      "output_tokens": 0,
      "input_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 0,
        "audio_tokens": 0
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtZOTeJk2bfvJE4youL",
  "item_id": "item_BaPtVGVbzht3q18x9GmLb",
  "content_index": 0,
  "delta": "Is that, is that how they usually talk to the computer?\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtZwmMCSIaPJsKAGE7O",
  "item_id": "item_BaPtVGVbzht3q18x9GmLb",
  "content_index": 0,
  "transcript": "Is that, is that how they usually talk to the computer?\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Is that, is that how they usually talk to the computer?
BillNegotiatorClient.tsx:208 User transcript completed: Is that, is that how they usually talk to the computer?
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtapx2GeFxjacPFVGM3",
  "audio_end_ms": 59552,
  "item_id": "item_BaPtZl1LVHXLnPB9WNzZ6"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtayyodmV55FmLuTrLG",
  "previous_item_id": "item_BaPtVGVbzht3q18x9GmLb",
  "item_id": "item_BaPtZl1LVHXLnPB9WNzZ6"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtaKJU9ZqHngQCBMLCq",
  "previous_item_id": "item_BaPtVGVbzht3q18x9GmLb",
  "item": {
    "id": "item_BaPtZl1LVHXLnPB9WNzZ6",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtaCKGSQVoZLgYsingL",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPta1LciBsBTHQ2oIbH7",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPtbJtdFZxWZO4YLcIc5",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14993986,
      "reset_seconds": 0.024
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPtbRUDV0RJhisT2QKxB",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "output_index": 0,
  "item": {
    "id": "item_BaPtaOCkNJBMKTaklmBnQ",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtbvQYVoRMGgVkDklF5",
  "previous_item_id": "item_BaPtZl1LVHXLnPB9WNzZ6",
  "item": {
    "id": "item_BaPtaOCkNJBMKTaklmBnQ",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPtbuoMIR2MU4uhM5hgB",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtbbBXGFo822f6zUb1j",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0,
  "delta": "Okay"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtb8WmUCCao1psCiY9g",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtbkK49W0cElXNscWDY",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtbOGRv2oQ2gmNGgDLz",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0,
  "delta": " best"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtbSifb3wW6XAwsYp3j",
  "item_id": "item_BaPtZl1LVHXLnPB9WNzZ6",
  "content_index": 0,
  "delta": "Yeah\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtbFnlP6zdd7LZW9ASk",
  "item_id": "item_BaPtZl1LVHXLnPB9WNzZ6",
  "content_index": 0,
  "transcript": "Yeah\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Yeah
BillNegotiatorClient.tsx:208 User transcript completed: Yeah
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_4285a48b530d463f",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_started Data: {
  "type": "input_audio_buffer.speech_started",
  "event_id": "event_BaPtbcUodGpiyaNJuTjuy",
  "audio_start_ms": 60756,
  "item_id": "item_BaPtbexeqwNp8ecrSQBds"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.cleared Data: {
  "type": "output_audio_buffer.cleared",
  "event_id": "event_50addfb542a44d88",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPtbbpsipVyJlSNQYfkq",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPtbBTML6q2O79CdSs7O",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0,
  "transcript": "Okay, to best"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPtbldpXEBNoAsiagNTu",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "Okay, to best"
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPtb0XxwviTtV6zRYLm5",
  "response_id": "resp_BaPta1LciBsBTHQ2oIbH7",
  "output_index": 0,
  "item": {
    "id": "item_BaPtaOCkNJBMKTaklmBnQ",
    "object": "realtime.item",
    "type": "message",
    "status": "incomplete",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "Okay, to best"
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  "event_id": "event_BaPtbHLADhOamLgcs0pek",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPta1LciBsBTHQ2oIbH7",
    "status": "cancelled",
    "status_details": {
      "type": "cancelled",
      "reason": "turn_detected"
    },
    "output": [
      {
        "id": "item_BaPtaOCkNJBMKTaklmBnQ",
        "object": "realtime.item",
        "type": "message",
        "status": "incomplete",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "Okay, to best"
          }
        ]
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1515,
      "input_tokens": 1491,
      "output_tokens": 24,
      "input_token_details": {
        "text_tokens": 1031,
        "audio_tokens": 460,
        "cached_tokens": 0,
        "cached_tokens_details": {
          "text_tokens": 0,
          "audio_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 9,
        "audio_tokens": 15
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.truncated Data: {
  "type": "conversation.item.truncated",
  "event_id": "event_BaPtbVtwAFDfjOn8fiZat",
  "item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "content_index": 0,
  "audio_end_ms": 20
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.speech_stopped Data: {
  "type": "input_audio_buffer.speech_stopped",
  "event_id": "event_BaPtc28DPseTYOPleplNt",
  "audio_end_ms": 61408,
  "item_id": "item_BaPtbexeqwNp8ecrSQBds"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: input_audio_buffer.committed Data: {
  "type": "input_audio_buffer.committed",
  "event_id": "event_BaPtcLfKXWrsVyqRcY79m",
  "previous_item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "item_id": "item_BaPtbexeqwNp8ecrSQBds"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtbYPXNGXYkhTThmry6",
  "previous_item_id": "item_BaPtaOCkNJBMKTaklmBnQ",
  "item": {
    "id": "item_BaPtbexeqwNp8ecrSQBds",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_audio",
        "transcript": null
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.created Data: {
  "type": "response.created",
  "event_id": "event_BaPtczCpIkC1VdCyt4FKv",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": null,
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.delta Data: {
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_BaPtckECx8qZL51FBCQW9",
  "item_id": "item_BaPtbexeqwNp8ecrSQBds",
  "content_index": 0,
  "delta": "Heh.\n"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.input_audio_transcription.completed Data: {
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_BaPtcOZdp4ye8P2ICloM3",
  "item_id": "item_BaPtbexeqwNp8ecrSQBds",
  "content_index": 0,
  "transcript": "Heh.\n"
}
VM786 useRealtimeNegotiation.ts:676 REALTIME_HOOK: User transcript completed, calling onUserTranscriptCompleted with: Heh.
BillNegotiatorClient.tsx:208 User transcript completed: Heh.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: rate_limits.updated Data: {
  "type": "rate_limits.updated",
  "event_id": "event_BaPtcuIR90zlRbXqE3EyR",
  "rate_limits": [
    {
      "name": "requests",
      "limit": 20000,
      "remaining": 19999,
      "reset_seconds": 0.003
    },
    {
      "name": "tokens",
      "limit": 15000000,
      "remaining": 14993970,
      "reset_seconds": 0.024
    }
  ]
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPtcuTAhu5EZdEZhcbCI",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "output_index": 0,
  "item": {
    "id": "item_BaPtcIcpHlzzNVveSqnRA",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtcUGM0RkN6jbkBQ4V1",
  "previous_item_id": "item_BaPtbexeqwNp8ecrSQBds",
  "item": {
    "id": "item_BaPtcIcpHlzzNVveSqnRA",
    "object": "realtime.item",
    "type": "message",
    "status": "in_progress",
    "role": "assistant",
    "content": []
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.added Data: {
  "type": "response.content_part.added",
  "event_id": "event_BaPtc3Cu8qxXidLvVhmtg",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtcNxrfVfrlZyHG1fXQ",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": "I"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtcHiiNAfQZt4fMhjga",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " understand"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtc9nwbPoQMzmrG6BRV",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " this"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.started Data: {
  "type": "output_audio_buffer.started",
  "event_id": "event_e6e09dc906384485",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtcjf3Rk1EcRX0oj5zb",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " is"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtcvP04EyYrxfHmZqWf",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " frustrating"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtcjudhLNHrcMzo69Pk",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdLMePRTMJxV6IjrcW",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " To"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdkXhcLSJk8Ovkhj44",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " best"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdf8jyMZYZgrNoMTMt",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " help"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdjyVXOy9Z3RYlGyvE",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdvgJI3gsRVPlIYeqo",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " with"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdQFoVjb5uCsMcNDUW",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " this"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdDUnAKjtpFrF52bB4",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtd8LkEYEm2xj8r14bU",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " I'm"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdp3xHvWpwY0A9MkHl",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " going"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtd20o2o3mv0mCoBH0t",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdsgGO5X1Z3UD0QhfY",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " transfer"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdeKWawSWzSbZDAZW3",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " you"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdmG5XkUDOUohR2GX5",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdYd1Glf985qIB8AnO",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " my"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtd0Yx0PTJjwRstAKeX",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " supervisor"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdU7PEPQm1UGMb540k",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdqiWzfmluaT4UawZZ",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " Marco"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtdiyjWTTdy34ZtnrWZ",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtedZZwmzcoxOgtActY",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " Please"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtesUGGPlLABOuMWpu3",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " allow"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPte0AyYWSYlY3kIn16K",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " me"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtenl1PeCim8EFVgTyV",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " a"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPteTSt37fbZo2sSf6kk",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " moment"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPteko6zTxg7QY2avDrK",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPtewHTaBFusmLIKsXRr",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " do"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPterrf9XvQM4qNp2YLF",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": " that"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.delta Data: {
  "type": "response.audio_transcript.delta",
  "event_id": "event_BaPteeI3OPON86KUitFWp",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio.done Data: {
  "type": "response.audio.done",
  "event_id": "event_BaPtfgRETtSoR9DA9mMJf",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.audio_transcript.done Data: {
  "type": "response.audio_transcript.done",
  "event_id": "event_BaPtfRor8DjEFf13Au4ux",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.content_part.done Data: {
  "type": "response.content_part.done",
  "event_id": "event_BaPtfeMrTovStaD3UG857",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "output_index": 0,
  "content_index": 0,
  "part": {
    "type": "audio",
    "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that."
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPtfpjs7XrplYgKs9TYj",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "output_index": 0,
  "item": {
    "id": "item_BaPtcIcpHlzzNVveSqnRA",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that."
      }
    ]
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.added Data: {
  "type": "response.output_item.added",
  "event_id": "event_BaPtg22fQYkR6RfQaAH6g",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "output_index": 1,
  "item": {
    "id": "item_BaPtftRlSksSFbdHsj0OZ",
    "object": "realtime.item",
    "type": "function_call",
    "status": "in_progress",
    "name": "transferToSupervisor",
    "call_id": "call_kmnUtkOoDYWLgJHP",
    "arguments": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: conversation.item.created Data: {
  "type": "conversation.item.created",
  "event_id": "event_BaPtgJzeCqJt8tKVqn8k3",
  "previous_item_id": "item_BaPtcIcpHlzzNVveSqnRA",
  "item": {
    "id": "item_BaPtftRlSksSFbdHsj0OZ",
    "object": "realtime.item",
    "type": "function_call",
    "status": "in_progress",
    "name": "transferToSupervisor",
    "call_id": "call_kmnUtkOoDYWLgJHP",
    "arguments": ""
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgWjmMB41LDbACVeoJ",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "{\""
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgmzLiCKm8PiNmc8Xt",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "destination"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgbnL8RAGqZRHJSlDj",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "_agent"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgT6QKgdFfwftjV6X5",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "_name"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg53jJlzvkewxckN4v",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "\":\""
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgJikkRiT7NDNFPs4x",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "mar"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgmDrJR6RQE9uYiGZY",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "co"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtghdB80PocSESx6ihl",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "_super"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgjbBvKjkflJrtXJmj",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "visor"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtghN08tZ1NyfXbyfam",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "_b"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgzyvAKJPLgSzipIM4",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "iller"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg5WKRRaDW4mB8pe9w",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "\",\""
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgS90wxoJiAdf6I1CO",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "reason"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgLOPuZ73AAuBkFAgH",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "\":\""
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgED9KfMyqidjG7IL5",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "The"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgVxgRn4nXugSbBjvU",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " customer"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtggiTqVr8BXv3POA79",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " is"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgD8Xr8wnrvBIK0cBR",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " unable"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgvTcdVIaiyZiwfuoX",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg7Ff2kDfEm22bpUYK",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " clearly"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgKze8cbQ2sDyN6fJP",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " communicate"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgETtPYPDkm3if7Lvj",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " their"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgvuHItWKMBaTBuRAY",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " issue"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgroTkDCQPmry4ugf4",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " and"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgihGSJ3dc58BFmqYe",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " has"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgeAma4oqhS61pZKGL",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " expressed"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg4lozAzeDXmtlXlRs",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " frustration"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgiaXYg3HfRyu1XMNi",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg3lwiRgMKuwx88eDA",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " requiring"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgH1t6O1OHGP9YlWVz",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " further"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgazQsMiT1EayuzWjt",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " assistance"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgSKNbBLIj8jUZTt7M",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " from"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgQvL6oLLFYhuGC3A8",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " a"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgQzmzhfcE4riFCG7N",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " supervisor"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgSdsjW7N3fcAszoMw",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": ".\",\""
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgCQOhiazlmMONlXQ4",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "conversation"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg1zUfD5SlRxUIG6Zc",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "_summary"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgoyEiee7IVvtz5xmc",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "\":\""
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgFZIEL57cUQmQ1skv",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "The"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgF9IIIB3MyPtJWMUx",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " customer"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgHcwhXcW3Zy84ZdAY",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " has"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg4yK7AsZAxG86kHrc",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " not"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgJ5InfSOBTexCW3pw",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " communicated"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg4vri1aY9vAt1VF1Q",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " their"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg0AGhfwdAstDPhf5A",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " specific"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgLJZikRlcyanS7cFc",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " issue"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgIQTVDX8gVZrcwwxM",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " clearly"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgJ4JzW6vN6Ne2myT5",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": ","
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg7Oyf0nFP9bQaODIV",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " but"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgUnPhCSaZL2sB4WF5",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " they"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg8kfGlFEqfIqJBwzi",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " have"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgOu1YAq6PS6vCbWyU",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " expressed"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgEoVHtyVrSqReqzm7",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " frustration"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtguxxHqVQR2oiYlHYN",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " and"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgdkKUO8ePtuFEhf3b",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " a"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg7tBTIznKrjpeWgV0",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " desire"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgnI0yHsqtBwD4FMVw",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgPcTRcX2lzlHoffy8",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " speak"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg6ekO8cP2SHJcPN7R",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgq8SPZLaW0fkGx4Ua",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " a"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgf13zwF7xhJoAYL18",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " supervisor"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgjkLvqOjo4ohXI0HH",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "."
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgg33e9Dk4suPqiGGR",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " Attempts"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg4HNesHrTQOyI5XjX",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgs0aZGbX11m6yde1i",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " gather"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgzSap2iG7slFx14U7",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " more"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg4nU0WbnO0u8xLduO",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " information"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgsjD4yc8dcvCk9GG2",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " were"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgdhVpWzpBCq7MM99a",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " unsuccessful"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgw2antrAWTv8Ji6BA",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " due"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgFp4DQHwfxERmV14L",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " to"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgw9Jfgj1bHFGghCLj",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " unclear"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgcUrImIZRbJZ9wLmQ",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": " communication"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtgSbf2n9McDiIdnt29",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": ".\""
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.delta Data: {
  "type": "response.function_call_arguments.delta",
  "event_id": "event_BaPtg7fQFqYMFxbZTgZLN",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "delta": "}"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.function_call_arguments.done Data: {
  "type": "response.function_call_arguments.done",
  "event_id": "event_BaPtg0oN8mQVeSCGLpJ5n",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "item_id": "item_BaPtftRlSksSFbdHsj0OZ",
  "output_index": 1,
  "call_id": "call_kmnUtkOoDYWLgJHP",
  "name": "transferToSupervisor",
  "arguments": "{\"destination_agent_name\":\"marco_supervisor_biller\",\"reason\":\"The customer is unable to clearly communicate their issue and has expressed frustration, requiring further assistance from a supervisor.\",\"conversation_summary\":\"The customer has not communicated their specific issue clearly, but they have expressed frustration and a desire to speak to a supervisor. Attempts to gather more information were unsuccessful due to unclear communication.\"}"
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.output_item.done Data: {
  "type": "response.output_item.done",
  "event_id": "event_BaPtgIsNJ9TRUGasJdWUC",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
  "output_index": 1,
  "item": {
    "id": "item_BaPtftRlSksSFbdHsj0OZ",
    "object": "realtime.item",
    "type": "function_call",
    "status": "completed",
    "name": "transferToSupervisor",
    "call_id": "call_kmnUtkOoDYWLgJHP",
    "arguments": "{\"destination_agent_name\":\"marco_supervisor_biller\",\"reason\":\"The customer is unable to clearly communicate their issue and has expressed frustration, requiring further assistance from a supervisor.\",\"conversation_summary\":\"The customer has not communicated their specific issue clearly, but they have expressed frustration and a desire to speak to a supervisor. Attempts to gather more information were unsuccessful due to unclear communication.\"}"
  }
}
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: response.done Data: {
  "type": "response.done",
  **HERE**
  "event_id": "event_BaPtgTeo8XlFZUUkLxYQ3",
  "response": {
    "object": "realtime.response",
    "id": "resp_BaPtbPrPNx7k1k6Gl19Lx",
    "status": "completed",
    "status_details": null,
    "output": [
      {
        "id": "item_BaPtcIcpHlzzNVveSqnRA",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
          {
            "type": "audio",
            "transcript": "I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that."
          }
        ]
      },
      {
        "id": "item_BaPtftRlSksSFbdHsj0OZ",
        "object": "realtime.item",
        "type": "function_call",
        "status": "completed",
        "name": "transferToSupervisor",
        "call_id": "call_kmnUtkOoDYWLgJHP",
        "arguments": "{\"destination_agent_name\":\"marco_supervisor_biller\",\"reason\":\"The customer is unable to clearly communicate their issue and has expressed frustration, requiring further assistance from a supervisor.\",\"conversation_summary\":\"The customer has not communicated their specific issue clearly, but they have expressed frustration and a desire to speak to a supervisor. Attempts to gather more information were unsuccessful due to unclear communication.\"}"
      }
    ],
    "conversation_id": "conv_BaPscIZ7aWE0hH59M3OYF",
    "modalities": [
      "text",
      "audio"
    ],
    "voice": "coral",
    "output_audio_format": "pcm16",
    "temperature": 0.8,
    "max_output_tokens": "inf",
    "usage": {
      "total_tokens": 1837,
      "input_tokens": 1513,
      "output_tokens": 324,
      "input_token_details": {
        "text_tokens": 1047,
        "audio_tokens": 466,
        "cached_tokens": 1408,
        "cached_tokens_details": {
          "text_tokens": 1024,
          "audio_tokens": 384
        }
      },
      "output_token_details": {
        "text_tokens": 135,
        "audio_tokens": 189
      }
    },
    "metadata": null
  }
}
VM786 useRealtimeNegotiation.ts:872 Server response.done event received.
VM786 useRealtimeNegotiation.ts:502 REALTIME_HOOK_DEBUG: Raw server event received. Type: output_audio_buffer.stopped Data: {
  "type": "output_audio_buffer.stopped",
  "event_id": "event_ca722ea4f0cf4360",
  "response_id": "resp_BaPtbPrPNx7k1k6Gl19Lx"
}
hot-reloader-client.js:242 [Fast Refresh] rebuilding
hot-reloader-client.js:74 [Fast Refresh] done in 214ms
hot-reloader-client.js:74 [Fast Refresh] done in 248ms
hot-reloader-client.js:242 [Fast Refresh] rebuilding
hot-reloader-client.js:74 [Fast Refresh] done in 551ms
hot-reloader-client.js:242 [Fast Refresh] rebuilding
hot-reloader-client.js:74 [Fast Refresh] done in 258ms
VM786 useRealtimeNegotiation.ts:220 REALTIME_HOOK: Call duration pre-warning period reached.
useRealtimeNegotiation.useCallback[connect] @ VM786 useRealtimeNegotiation.ts:220
VM786 useRealtimeNegotiation.ts:238 REALTIME_HOOK: Maximum call duration reached after warning. Disconnecting.
useRealtimeNegotiation.useCallback[connect] @ VM786 useRealtimeNegotiation.ts:238
setTimeout
useRealtimeNegotiation.useCallback[connect] @ VM786 useRealtimeNegotiation.ts:236
VM786 useRealtimeNegotiation.ts:415 Disconnect function called.
VM786 useRealtimeNegotiation.ts:453 Disconnected.
VM786 useRealtimeNegotiation.ts:344 Data channel CLOSED.
BillNegotiatorClient.tsx:217 BN_CLIENT: Agent ended call, scheduling disconnection in 500ms via useEffect.
BillNegotiatorClient.tsx:359 BN_CLIENT: Scoring via useEffect. Transcript for scoring: SARAH: Hi there! Thank you for calling. My name is Sarah. How can I assist you with your billing issue today?
USER: Go with that.
SARAH: I'm here to help! What can I do for you today?
USER: Hello
SARAH: Alright, it sounds like you might be having some trouble. How about we start by talking about your billing issue?
USER: Um...
USER: Can I talk to your supervisor?
SARAH: I understand you'd like to speak with a supervisor. I'll transfer you to my supervisor, Marco, who can assist you further. Please give me a moment.
USER: I just can't get over it.
USER: Yeah.
USER: Okay.
SARAH: I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please
USER: pfft
SARAH: I'm going to transfer
USER: Is that, is that how they usually talk to the computer?
USER: Yeah
SARAH: Okay, to best
USER: Heh.
SARAH: I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that.
USER: [System: Call approaching maximum duration. The call will end in 30 seconds.]
BillNegotiatorClient.tsx:100 BN_CLIENT: score() called. Transcript provided: SARAH: Hi there! Thank you for calling. My name is Sarah. How can I assist you with your billing issue today?
USER: Go with that.
SARAH: I'm here to help! What can I do for you today?
USER: Hello
SARAH: Alright, it sounds like you might be having some trouble. How about we start by talking about your billing issue?
USER: Um...
USER: Can I talk to your supervisor?
SARAH: I understand you'd like to speak with a supervisor. I'll transfer you to my supervisor, Marco, who can assist you further. Please give me a moment.
USER: I just can't get over it.
USER: Yeah.
USER: Okay.
SARAH: I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please
USER: pfft
SARAH: I'm going to transfer
USER: Is that, is that how they usually talk to the computer?
USER: Yeah
SARAH: Okay, to best
USER: Heh.
SARAH: I understand this is frustrating. To best help you with this, I'm going to transfer you to my supervisor, Marco. Please allow me a moment to do that.
USER: [System: Call approaching maximum duration. The call will end in 30 seconds.]
BillNegotiatorClient.tsx:107 BN_CLIENT: Score API response status: 200 OK?: true
BillNegotiatorClient.tsx:117 BN_CLIENT: Score API response JSON: {
  "text": "```json\n{\n  \"strengths\": [\n    \"Persistent in trying to address the billing issue\"\n  ],\n  \"improvements\": [\n    \"Clearly articulate the specific billing issue to the representative\",\n    \"Stay focused on the goals of the call rather than distractions\",\n    \"Effectively communicate the desired outcome or resolution\"\n  ],\n  \"outcome\": \"No reduction was achieved as the call was primarily with the initial representative and the issue was not clearly articulated.\",\n  \"rating\": \"⭐☆☆☆☆\"\n}\n```"
}
