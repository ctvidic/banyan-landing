export interface ToolParameterProperty {
  type: string;
  description?: string;
  enum?: string[];
  pattern?: string;
  properties?: Record<string, ToolParameterProperty>;
  required?: string[];
  additionalProperties?: boolean;
  items?: ToolParameterProperty;
}

export interface ToolParameters {
  type: string;
  properties: Record<string, ToolParameterProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

// Alias for FunctionDefinition as per the refactor plan
export type FunctionDefinition = ToolParameters;

export interface Tool {
  type: "function";
  name: string;
  description: string;
  parameters: ToolParameters; // Renamed from FunctionDefinition for consistency with OpenAI
}

// Forward declaration for TranscriptItem to resolve circular dependency if AgentConfig uses it directly or indirectly.
// Actual definition would be in a more general types file.
export interface TranscriptItem {
  itemId: string;
  type: "MESSAGE" | "BREADCRUMB";
  role?: "user" | "assistant";
  title?: string;
  data?: Record<string, any>;
  expanded: boolean;
  timestamp: string;
  createdAtMs: number;
  status: "IN_PROGRESS" | "DONE";
  isHidden: boolean;
  // guardrailResult?: GuardrailResultType; // Assuming GuardrailResultType would also be defined elsewhere
}


export interface AgentConfig {
  name: string;
  publicDescription: string;
  instructions: string;
  tools: Tool[];
  // Keeping toolLogic and downstreamAgents as in the example,
  // but downstreamAgents will be simplified in the config files as per the example's utils.ts
  toolLogic?: Record<
    string,
    (args: any, transcriptLogsFiltered: TranscriptItem[]) => Promise<any> | any
  >;
  downstreamAgents?:
    | AgentConfig[]
    | { name: string; publicDescription: string }[];
}

// It's good practice to also define related types if they are closely coupled,
// but for now, focusing on the core types requested.
// If other types like AllAgentConfigsType, GuardrailResultType, etc. are needed
// they should be added here or in a more general types file. 