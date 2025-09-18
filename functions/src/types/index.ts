/**
 * Centralized type exports for the application
 */

// Message types
export type {
  MessageRole,
  BaseMessage,
  MessageWithUser,
  MessageDocument,
  CreateMessageInput,
  OpenAIMessage,
  MessageResponse,
  ErrorResponse,
  ApiResponse,
} from "./message";

// User types
export type { UserInfo } from "./user";

// Re-export commonly used types for convenience
export type { Timestamp } from "firebase-admin/firestore";
