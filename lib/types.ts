// Shared TypeScript types for kanribu-ai

export interface User {
  id: string
  name: string
  email: string
  avatarInitial: string
  role: "admin" | "editor" | "viewer"
}

export interface Tenant {
  id: string
  name: string
  slug: string
  locale: "ja" | "en"
  timezone: string
  plan: "starter" | "pro" | "enterprise"
  planPrice: number
}

export interface EntityField {
  id: string
  displayName: string
  type:
    | "text"
    | "long-text"
    | "number"
    | "date"
    | "datetime"
    | "select"
    | "multi-select"
    | "reference"
    | "file"
    | "rich-text"
    | "checkbox"
    | "calculated"
    | "ai-generated"
  options?: string[]
  target?: string
  required?: boolean
  showInList?: boolean
  helpText?: string
}

export interface Entity {
  id: string
  displayName: string
  icon: string
  recordCount: number
  fields: EntityField[]
  description?: string
  exposed?: boolean
}

export interface Record {
  id: string
  entityId: string
  data: { [key: string]: unknown }
  createdAt: string
  createdBy: { name: string; avatarInitial: string }
  updatedAt: string
  updatedBy: { name: string; avatarInitial: string }
  mcpExposed?: boolean
}

export interface ActivityItem {
  id: string
  user: string
  avatarInitial: string
  action: "作成" | "更新" | "削除"
  entity: string
  recordTitle: string
  time: string
  diff?: { [field: string]: { before: string; after: string } }
}

export interface Workflow {
  id: string
  name: string
  description: string
  targetEntity: string | null
  targetEntityDisplay: string
  trigger: "manual" | "on-create" | "on-update" | "scheduled" | "via-mcp" | "via-a2a"
  schedule?: string
  agentMode: "single" | "trivium"
  agentModel?: string
  a2aExposed: boolean
  lastRun?: { time: string; status: "success" | "failed" | "running" }
  monthlyRuns: number
}

export interface TriviumTrace {
  grammatica: {
    model: string
    tokensIn: number
    tokensOut: number
    cost: number
    output: string
    prompt?: string
  }
  logica: {
    model: string
    tokensIn: number
    tokensOut: number
    cost: number
    output: string
    prompt?: string
  }
  rhetorica: {
    model: string
    tokensIn: number
    tokensOut: number
    cost: number
    output: string
    prompt?: string
  }
}

export interface WorkflowRun {
  id: string
  workflowId: string
  startedAt: string
  duration: string
  status: "completed" | "failed" | "running" | "canceled"
  cost: number
  tokensTotal?: number
  triggeredBy: string
  trivium?: TriviumTrace
  input?: object
  output?: object
  error?: string
}

export interface ConversationMessage {
  id: string
  role: "user" | "assistant"
  content: MessageContent[]
  timestamp: string
}

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "tool_call"; name: string; input: object; output: object }
  | {
      type: "proposed_change"
      scope: string
      description: string
      diff: { before: string; after: string }
      status?: "pending" | "applied" | "rejected"
    }
  | { type: "trivium_trace"; trace: TriviumTrace }
  | { type: "code"; language: string; code: string }

export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ConversationMessage[]
}

export interface ApiKey {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsed: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
  invoiceUrl: string
}

export interface MCPUsage {
  thisMonth: number
  lastMonth: number
  quota: number
  history: { day: number; calls: number }[]
}

export interface ExposedAgent {
  workflowId: string
  name: string
  cardUrl: string
}

export interface Member {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "viewer"
  joinedAt: string
  avatarInitial: string
}
