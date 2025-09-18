import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { messageService } from "../services/messageService";
import { validateMessageDto, ValidationError } from "../utils/validation";
import { extractClientInfo } from "../utils/session";
import { MessageResponse } from "../types/message";
import { UserInfo } from "../types/user";

export const sendMessage = onRequest(async (request, response) => {
  try {
    // Extract client info for logging/tracking
    const { ipAddress, userAgent } = extractClientInfo(request);

    // Validate input using DTO
    const validatedDto = await validateMessageDto(request.body);

    // Create user info
    const userInfo: UserInfo = {
      ipAddress,
      userAgent,
    };

    // Save to Firestore with user identification
    const docRef = await messageService.saveMessage(
      validatedDto.message,
      userInfo
    );

    // Log success with user info
    logger.info("Message saved successfully", {
      messageId: docRef.id,
      message: validatedDto.message,
      ipAddress,
      userAgent,
    });

    // Send response
    const responseData: MessageResponse = {
      success: true,
      messageId: docRef.id,
      message: "Message saved successfully",
    };

    response.status(200).send(responseData);
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn("Validation error", { error: error.message });
      response.status(400).send({ error: error.message });
    } else {
      logger.error("Error saving message", error);
      response.status(500).send({ error: "Failed to save message" });
    }
  }
});
