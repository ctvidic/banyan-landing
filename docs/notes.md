# Functionality
## Escalation
* Checks if supervisor is requested, allows for one more message from frontline agent then 
transfers REGARDLESS (this is the downside of no tool-calling)


### agent logic and definition
* openai-realtime-agents: This example promotes a more structured and modular way to define agents. Each agent (haikuWriter, greeter in simpleExample.ts) is an AgentConfig object with distinct properties like name, publicDescription, instructions, and tools. The voiceAgentMetaprompt.txt even suggests a sophisticated way to generate these detailed instructions, potentially including complex state machines for conversation flow.


### tool usage & extensibility
* openai-realtime-agents: This structure is designed for tool use. The tools array in AgentConfig and utilities like injectTransferTools (in agentConfigs/utils.ts) show a clear path to defining capabilities that agents can invoke. For instance, an agent could have a tool to "transferToAgentX" or "lookupCustomerDetails."

### session management for role change
* openai-realtime-agents: A transfer (like an escalation) would likely be modeled as a tool. The frontline agent, when prompted or deciding to escalate, would "call" a transferToSupervisor tool. The client (your hook/component) would interpret this tool call and then initiate the connection to the supervisor agent. This makes the agent's decision to escalate more autonomous and part of its defined behavior, rather than purely client-driven based on keyword spotting.




## PHASE 3 NOTES
* For now, I will comment out the agentLogic function and its usage in onUserTranscriptCompleted, as well as the useEffect block responsible for role changes, because they heavily depend on the old roleRef and currentRoleForEffect logic. These will be addressed in a later step (Phase 3).

* I'll also add a TODO comment regarding the agent's voice, as the plan suggests it could also be derived from the AgentConfig, which would be a cleaner approach than the current name-based derivation.