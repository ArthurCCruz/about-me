import { db } from "./firebase";
import { Timestamp } from "firebase-admin/firestore";
import { MessageWithUser, UserInfo } from "../types/user";

/**
 * Service class for handling message operations.
 */
export class MessageService {
  /**
   * Saves a message to Firestore.
   * @param message - The message text to save
   * @param userInfo - User identification info (IP, User Agent)
   * @return The document reference
   */
  async saveMessage(message: string, userInfo: UserInfo) {
    const messageData: MessageWithUser = {
      message: message.trim(),
      ipAddress: userInfo.ipAddress,
      userAgent: userInfo.userAgent,
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    };

    return await db.collection("messages").add(messageData);
  }

  /**
   * Gets messages by IP address and User Agent.
   * @param ipAddress - The IP address to filter by
   * @param userAgent - The User Agent to filter by
   * @return Array of messages
   */
  async getMessages(ipAddress: string, userAgent: string) {
    const snapshot = await db.collection("messages")
      .where("ipAddress", "==", ipAddress)
      .where("userAgent", "==", userAgent)
      .orderBy("createdAt", "asc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}

export const messageService = new MessageService();
