import { Timestamp } from "firebase-admin/firestore";

/**
 * Message roles for conversation tracking
 */
export type MessageRole = "user" | "assistant";

/**
 * Base message interface with core properties
 */
export interface BaseMessage {
  message: string;
  role: MessageRole;
  createdAt: Timestamp;
}

/**
 * Message with user identification
 */
export interface MessageWithUser extends BaseMessage {
  ipAddress: string;
  userAgent: string;
}

/**
 * Complete message document as stored in Firestore
 */
export interface MessageDocument extends MessageWithUser {
  id: string;
}

/**
 * Input data for creating a new message (without auto-generated fields)
 */
export type CreateMessageInput = Omit<MessageWithUser, "createdAt">;

/**
 * Message data for OpenAI conversation format
 */
export interface OpenAIMessage {
  role: MessageRole;
  content: string;
}

/**
 * API response for successful message operations
 */
export interface MessageResponse {
  success: true;
  messageId: string;
  answer: string;
}

/**
 * API response for failed operations
 */
export interface ErrorResponse {
  success: false;
  error: string;
}

/**
 * Union type for all possible API responses
 */
export type ApiResponse = MessageResponse | ErrorResponse;
