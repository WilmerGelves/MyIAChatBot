export type QueryType = "INVENTORY" | "SALES" | "UNKNOWN";

export interface ParsedQuery {
  type: QueryType;
  product?: string;
}

export interface ChatResponse {
  success: boolean;
  type: QueryType;
  message: string;
  data?: Record<string, unknown>;
  alert?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  alert?: boolean;
  loading?: boolean;
}
