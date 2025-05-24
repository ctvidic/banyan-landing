# Call Ending Behavior Guide

## Overview
This document describes the expected behavior for agents when ending calls, particularly when users say goodbye first.

## Expected Agent Behavior

### When User Initiates Goodbye
When a user says goodbye or indicates they want to end the call, agents must:

1. **Acknowledge the farewell** - Never ignore the user's goodbye
2. **Provide an appropriate response** - Thank them, wish them well, etc.
3. **Then use the end_call tool** - Only after acknowledging

#### Examples:

**Good:**
```
User: "Alright, thanks for your help. Goodbye!"
Agent: "You're very welcome! Thank you for calling today. Have a wonderful day!" 
[Agent then calls end_call tool with reason: "Customer request"]
```

**Bad:**
```
User: "Thanks, goodbye!"
[Agent immediately calls end_call tool without responding]
```

### When Agent Initiates Call End
When the agent determines it's time to end the call:

1. **Summarize if needed** - Recap any resolutions or next steps
2. **Ask if there's anything else** - Give the user a final chance for questions
3. **Provide a closing statement** - Thank them and wish them well
4. **Use the end_call tool**

#### Example:
```
Agent: "I've applied that $20 credit to your account. Is there anything else I can help you with today?"
User: "No, that's everything."
Agent: "Perfect! Thank you for calling, and have a great day!"
[Agent calls end_call tool with reason: "Issue resolved"]
```

## Technical Implementation

### Deferred End Call Mechanism
The system implements a deferred mechanism to ensure agents can finish speaking before the call disconnects:

1. When `end_call` tool is called while agent is speaking:
   - Tool response is deferred (not sent immediately)
   - System waits for audio to finish playing
   - Only then sends tool response and disconnects

2. This prevents audio cutoff and ensures users hear the complete farewell message

### Agent Instructions
Both frontline and supervisor agents have explicit instructions about:
- Conversational etiquette
- Proper acknowledgment of user farewells
- Natural conversation flow
- Specific examples of good behavior

## Testing Considerations

When testing call endings, verify:
1. Agent acknowledges user goodbyes before ending
2. Agent's farewell message plays completely without cutoff
3. System messages are clear and informative
4. Disconnect sound plays at the appropriate time
5. Call end reason is properly recorded 