# Fix for Agent Speech Cutoff During Transfers

## Problem Description
When the frontline agent (Sarah) initiated a transfer to the supervisor (Marco), her speech was being cut off before she could finish her transfer announcement. For example, when Sarah said "Alright, I understand. I'll transfer you to my supervisor, Marco. Please hold for just a moment.", the audio would be cut off mid-sentence and Marco would immediately start speaking.

## Root Cause Analysis
The issue occurred because:
1. OpenAI's Realtime API sends both the agent's audio message and the transfer function call in the same `response.done` event
2. The system was immediately processing the transfer and sending a tool response back to OpenAI
3. OpenAI's server closes the WebRTC connection as soon as it receives the tool response for a transfer
4. This caused the data channel to close before the agent's audio finished playing

## Solution Overview
The fix implements a deferred transfer mechanism that:
1. Detects when audio and a transfer function call are in the same response
2. Defers sending the tool response until the audio has finished playing
3. Only initiates the actual transfer after the agent completes speaking

## Technical Implementation

### 1. New State Management
Added new refs to track deferred transfers:
- `pendingTransferDetailsRef`: Stores transfer details (toolCallId, targetAgentName, transferArgs) when deferring
- `expectingAudioStopForTransferRef`: Boolean flag to track when we're waiting for audio to stop

### 2. Enhanced Transfer Detection
Modified `response.done` handler to analyze responses before processing:
```typescript
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
```

### 3. Modified `handleTransferToolCall` Function
Updated to accept `hasAudioInSameResponse` parameter and defer tool response when audio is present:
- If audio is in the same response: Stores transfer details and shows "Preparing to transfer..." message
- If no audio: Proceeds with immediate transfer as before
- Crucially: Only sends the tool response when actually ready to transfer

### 4. Enhanced `output_audio_buffer.stopped` Handler
When audio stops playing:
1. Checks if there's a pending transfer in `pendingTransferDetailsRef`
2. Sends the deferred tool response to OpenAI
3. Waits 100ms to ensure the response is processed
4. Disconnects and initiates the transfer to the new agent

### 5. Timing Considerations
Added a 100ms delay between sending the tool response and disconnecting to prevent race conditions between:
- Client sending the tool response
- OpenAI server closing the connection
- Client disconnecting gracefully

## Code Changes Summary

### Modified Functions:
1. **`handleTransferToolCall`**: 
   - Added `hasAudioInSameResponse` parameter
   - Defers tool response when audio is present
   - Only sends tool response for immediate transfers

2. **`handleServerEvent` - `response.done` case**: 
   - Analyzes response for audio + transfer combination
   - Passes audio detection to `handleTransferToolCall`

3. **`handleServerEvent` - `output_audio_buffer.stopped` case**: 
   - Sends deferred tool response
   - Completes the transfer after audio finishes

4. **`disconnect`**: 
   - Clears `pendingTransferDetailsRef` and `expectingAudioStopForTransferRef`

## Testing Considerations
To verify the fix:
1. Test transfers when agent has a long farewell message
2. Test transfers when agent has a short message
3. Test transfers with no agent audio response
4. Test rapid user interruptions during transfer announcements
5. Verify supervisor still receives correct context after deferred transfers

## Future Improvements
1. Consider making the 100ms delay configurable
2. Add metrics to track transfer timing and success rates
3. Implement a timeout for deferred transfers in case `output_audio_buffer.stopped` never fires
4. Consider handling edge cases where multiple transfers are requested in quick succession 