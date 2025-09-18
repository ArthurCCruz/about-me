import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { messageService } from "../services/messageService";
import { openaiService } from "../services/openaiService";
import { validateQuestionDto, ValidationError } from "../utils/validation";
import { extractClientInfo } from "../utils/session";
import { UserInfo } from "../types/user";
import { MessageResponse, ErrorResponse, OpenAIMessage } from "../types/message";

export const sendMessage = onRequest(async (request, response) => {
  try {
    // Extract client info for logging/tracking
    const { ipAddress, userAgent } = extractClientInfo(request);

    // Validate input using DTO
    const validatedDto = await validateQuestionDto(request.body);

    // Create user info
    const userInfo: UserInfo = {
      ipAddress,
      userAgent,
    };

    // Save user question first
    await messageService.saveMessage(validatedDto.question, "user", userInfo);

    // Get message history for context
    const messageHistory = await messageService.getMessageHistory(
      ipAddress,
      userAgent
    );

    // Convert history to OpenAI format
    const history: OpenAIMessage[] = messageHistory.map((msg) => ({
      role: msg.role,
      content: msg.message,
    }));

    // Generate AI response
    const aiResponse = await openaiService.generateResponse(
      validatedDto.question,
      history
    );

    // Save AI response
    const docRef = await messageService.saveMessage(aiResponse, "assistant", userInfo);

    // Log success with user info
    logger.info("Question answered successfully", {
      messageId: docRef.id,
      question: validatedDto.question,
      answerLength: aiResponse.length,
      ipAddress,
      userAgent,
    });

    // Send response
    const responseData: MessageResponse = {
      success: true,
      answer: aiResponse,
      messageId: docRef.id,
    };

    response.status(200).send(responseData);
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn("Validation error", { error: error.message });
      const errorResponse: ErrorResponse = {
        success: false,
        error: error.message,
      };
      response.status(400).send(errorResponse);
    } else {
      logger.error("Error processing question", error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: "Failed to process question",
      };
      response.status(500).send(errorResponse);
    }
  }
});
