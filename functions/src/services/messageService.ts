import { db } from "./firebase";
import { Timestamp } from "firebase-admin/firestore";
import { MessageDocument, CreateMessageInput, MessageRole } from "../types/message";
import { UserInfo } from "../types/user";
import { getEnvironmentConfig } from "../config/environment";

/**
 * Service class for handling message operations.
 */
export class MessageService {
  private config: ReturnType<typeof getEnvironmentConfig>;

  constructor() {
    this.config = getEnvironmentConfig();
  }
  /**
   * Saves a message with role to Firestore.
   * @param message - The message content
   * @param role - The role of the message sender (user or assistant)
   * @param userInfo - User identification info (IP, User Agent)
   * @return The document reference
   */
  async saveMessage(message: string, role: MessageRole, userInfo: UserInfo) {
    const messageData: CreateMessageInput = {
      message: message.trim(),
      role,
      ipAddress: userInfo.ipAddress,
      userAgent: userInfo.userAgent,
    };

    return await db.collection("messages").add({
      ...messageData,
      createdAt: Timestamp.now(),
    });
  }

  /**
   * Gets message history by IP address and User Agent.
   * @param ipAddress - The IP address to filter by
   * @param userAgent - The User Agent to filter by
   * @return Array of message documents
   */
  async getMessageHistory(ipAddress: string, userAgent: string): Promise<MessageDocument[]> {
    const snapshot = await db.collection("messages")
      .where("ipAddress", "==", ipAddress)
      .where("userAgent", "==", userAgent)
      .orderBy("createdAt", "asc")
      .limit(this.config.app.messageHistoryLimit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MessageDocument[];
  }
}

export const messageService = new MessageService();
