import { Timestamp } from "firebase-admin/firestore";

export interface MessageRequest {
  message: string;
}

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  message: string;
}

export interface MessageDocument {
  message: string;
  timestamp: Timestamp;
  createdAt: Timestamp;
}
