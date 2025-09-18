import { Timestamp } from "firebase-admin/firestore";

export interface UserInfo {
  ipAddress: string;
  userAgent: string;
}

export interface MessageWithUser {
  message: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Timestamp;
  createdAt: Timestamp;
}
