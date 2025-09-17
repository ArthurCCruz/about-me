import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { messageService } from "./services/messageService";
import { validateMessageDto, ValidationError } from "./utils/validation";
import { MessageResponse } from "./types/message";

export const saveMessage = onRequest(async (request, response) => {
  try {
    // Validate input using DTO
    const validatedDto = await validateMessageDto(request.body);

    // Save to Firestore
    const docRef = await messageService.saveMessage(validatedDto.message);

    // Log success
    logger.info("Message saved successfully", {
      messageId: docRef.id,
      message: validatedDto.message,
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
