import { db } from "./firebase";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Service class for handling message operations.
 */
export class MessageService {
  /**
   * Saves a message to Firestore.
   * @param message - The message text to save
   * @return The document reference
   */
  async saveMessage(message: string) {
    const messageData = {
      message: message.trim(),
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    };
    return await db.collection("messages").add(messageData);
  }
}

export const messageService = new MessageService();
