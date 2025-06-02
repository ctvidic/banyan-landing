import { frontlineAgentConfig as rawFrontlineAgentConfig } from './frontlineAgent';
import { supervisorAgentConfig as rawSupervisorAgentConfig } from './supervisorAgent';
import { injectTransferTools } from './utils';
import { AgentConfig } from './types';

// Create an array of the raw agent configurations
const allAgentConfigs: AgentConfig[] = [
  rawFrontlineAgentConfig,
  rawSupervisorAgentConfig,
];

// Process the configurations to inject tools
// injectTransferTools modifies the objects in place and returns the array.
const processedAgentConfigs = injectTransferTools(allAgentConfigs);

// Find and export the specific, enriched agent configurations
// We can safely assume the order is preserved or find by name if necessary.
// For simplicity, we'll rely on the order or direct modification.

// Re-assigning to new constants for clarity, though rawFrontlineAgentConfig is already modified.
export const frontlineAgentConfig: AgentConfig = processedAgentConfigs.find(
  (agent) => agent.name === 'sarah_frontline_biller'
) as AgentConfig;

export const supervisorAgentConfig: AgentConfig = processedAgentConfigs.find(
  (agent) => agent.name === 'marco_supervisor_biller'
) as AgentConfig;

// Optional: Export all processed configs if needed elsewhere
// export const allProcessedAgentConfigs: AgentConfig[] = processedAgentConfigs;

// Log to console during development to verify tool injection (optional)
// console.log('Enriched Frontline Agent:', JSON.stringify(frontlineAgentConfig, null, 2));
// console.log('Enriched Supervisor Agent:', JSON.stringify(supervisorAgentConfig, null, 2)); 