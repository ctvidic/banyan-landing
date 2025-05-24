import { AgentConfig, Tool } from './types';

/**
 * Dynamically injects transfer and end call tools into agent configurations.
 * - Adds 'transferToSupervisor' tool if agent has downstream agents
 * - Adds 'end_call' tool to all agents
 */
export function injectTransferTools(agentConfigs: AgentConfig[]): AgentConfig[] {
  agentConfigs.forEach((agentConfig) => {
    // Ensure tools array exists
    if (!agentConfig.tools) {
      agentConfig.tools = [];
    }

    // Add end_call tool to all agents
    const endCallTool: Tool = {
      type: 'function',
      name: 'end_call',
      description: `Ends the current call with the customer. 
Use this tool when:
- The customer's issue has been fully resolved
- The customer explicitly wants to end the call
- The conversation has reached a natural conclusion
- The customer becomes abusive or the call cannot continue productively

Always provide a polite closing statement before using this tool.`,
      parameters: {
        type: 'object',
        properties: {
          reason: {
            type: 'string',
            description: 'A brief reason for ending the call (e.g., "Issue resolved", "Customer request", "Call concluded")',
          },
        },
        required: ['reason'],
      },
    };
    agentConfig.tools.push(endCallTool);

    // Ensure downstreamAgents is an array, even if it's undefined or null initially.
    // The type { name: string; publicDescription: string } is what we expect after this.
    const downstreamAgents = (agentConfig.downstreamAgents || []).map(da => ({
      name: da.name,
      publicDescription: da.publicDescription || 'No description provided'
    }));

    if (downstreamAgents.length > 0) {
      const availableAgentsList = downstreamAgents
        .map(
          (dAgent) =>
            `- ${dAgent.name}: ${dAgent.publicDescription}`
        )
        .join('\n');

      const transferSupervisorTool: Tool = {
        type: 'function',
        name: 'transferToSupervisor',
        description: `Triggers a transfer of the user to a designated supervisor. 
Use this tool when the situation requires escalation to a supervisor as per your instructions (e.g., customer request, complex issue beyond your scope, irate customer).
Always inform the user before initiating a transfer.

Available Supervisors (select one as destination_agent_name):
${availableAgentsList}`,
        parameters: {
          type: 'object',
          properties: {
            destination_agent_name: {
              type: 'string',
              description: 'The name of the supervisor agent to transfer to. This must be one of the available supervisors listed.',
              enum: downstreamAgents.map((dAgent) => dAgent.name),
            },
            reason: {
              type: 'string',
              description: 'A clear and concise reason why this transfer is necessary.',
            },
            conversation_summary: {
              type: 'string',
              description: 'A brief summary of the conversation so far, including the customer\'s issue and key points discussed, to provide context for the supervisor.',
            },
          },
          required: ['destination_agent_name', 'reason', 'conversation_summary'],
        },
      };

      agentConfig.tools.push(transferSupervisorTool);
    }

    // Standardize downstreamAgents to the simpler { name, publicDescription } format
    // to prevent issues with circular dependencies if full AgentConfig objects were present.
    agentConfig.downstreamAgents = downstreamAgents;
  });

  return agentConfigs;
} 