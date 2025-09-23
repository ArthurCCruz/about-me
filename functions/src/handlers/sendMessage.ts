import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { messageService } from "../services/messageService";
import { openaiService } from "../services/openaiService";
import { validateQuestionDto, ValidationError } from "../utils/validation";
import { extractClientInfo } from "../utils/session";
import { UserInfo } from "../types/user";
import { StreamingMessageResponse, ErrorResponse, OpenAIMessage } from "../types/message";

export const sendMessage = onRequest(async (request, response) => {
  let isStreaming = false;
  let streamTimeout: NodeJS.Timeout | null = null;

  // Handle client disconnect
  request.on("close", () => {
    if (streamTimeout) {
      clearTimeout(streamTimeout);
    }
    logger.info("Client disconnected during streaming");
  });

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

    // Set up Server-Sent Events headers for streaming
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Connection", "keep-alive");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    response.setHeader("Access-Control-Allow-Credentials", "true");

    // Send initial SSE setup
    response.write(": SSE connection established\n\n");

    // Create a placeholder message document first
    const docRef = await messageService.saveMessage("", "assistant", userInfo);

    // Send message ID to client
    response.write(`event: message-id\ndata: ${JSON.stringify({ messageId: docRef.id })}\n\n`);

    isStreaming = true;

    try {
      // Set up streaming timeout (5 minutes)
      streamTimeout = setTimeout(() => {
        if (isStreaming) {
          logger.warn("Streaming timeout reached", { messageId: docRef.id });
          response.write(`event: timeout\ndata: ${JSON.stringify({ reason: "stream_timeout" })}\n\n`);
          response.end();
        }
      }, 5 * 60 * 1000);

      // Generate streaming AI response
      const stream = await openaiService.generateStreamingResponse(
        validatedDto.question,
        history
      );

      let fullResponse = "";
      let chunkCount = 0;
      let lastHeartbeat = Date.now();

      // Stream the response
      for await (const chunk of stream) {
        // Check if client is still connected
        if (response.destroyed) {
          logger.info("Response stream destroyed, stopping streaming");
          break;
        }

        const content = chunk.choices[0]?.delta?.content || "";

        if (content) {
          fullResponse += content;
          chunkCount++;

          // Send chunk to client with proper SSE format
          const chunkData: StreamingMessageResponse = {
            success: true,
            messageId: docRef.id,
            chunk: content,
            isComplete: false,
          };

          response.write(`event: chunk\ndata: ${JSON.stringify(chunkData)}\n\n`);

          // Send heartbeat every 10 chunks or every 30 seconds
          const now = Date.now();
          if (chunkCount % 10 === 0 || (now - lastHeartbeat) > 30000) {
            response.write(`event: heartbeat\ndata: ${JSON.stringify({
              timestamp: now,
              chunkCount,
              messageId: docRef.id,
            })}\n\n`);
            lastHeartbeat = now;
          }
        }
      }

      // Clear timeout since streaming completed
      if (streamTimeout) {
        clearTimeout(streamTimeout);
      }

      // Update the saved message with the complete response
      if (fullResponse) {
        await messageService.updateMessage(docRef.id, fullResponse);
      }

      // Send final completion signal
      const finalData: StreamingMessageResponse = {
        success: true,
        messageId: docRef.id,
        chunk: "",
        isComplete: true,
      };

      response.write(`event: complete\ndata: ${JSON.stringify(finalData)}\n\n`);
      response.write(`event: close\ndata: ${JSON.stringify({ reason: "stream_complete" })}\n\n`);

      isStreaming = false;
    } catch (streamError) {
      // Clear timeout on error
      if (streamTimeout) {
        clearTimeout(streamTimeout);
      }

      // Handle streaming errors
      logger.error("Error during streaming", streamError);

      const errorData = {
        success: false,
        error: "Streaming error occurred",
        messageId: docRef.id,
      };

      if (!response.destroyed) {
        response.write(`event: error\ndata: ${JSON.stringify(errorData)}\n\n`);
        response.write(`event: close\ndata: ${JSON.stringify({ reason: "stream_error" })}\n\n`);
      }

      isStreaming = false;
    }

    response.end();

    // Log success with user info (only if streaming completed successfully)
    if (!isStreaming) {
      logger.info("Question answered successfully with streaming", {
        messageId: docRef.id,
        question: validatedDto.question,
        ipAddress,
        userAgent,
      });
    }
  } catch (error) {
    // Clear timeout on any error
    if (streamTimeout) {
      clearTimeout(streamTimeout);
    }

    if (error instanceof ValidationError) {
      logger.warn("Validation error", { error: error.message });

      if (!isStreaming) {
        // Send regular HTTP error response if not streaming yet
        const errorResponse: ErrorResponse = {
          success: false,
          error: error.message,
        };
        response.status(400).send(errorResponse);
      } else {
        // Send SSE error event if already streaming
        const errorData = {
          success: false,
          error: error.message,
        };
        response.write(`event: error\ndata: ${JSON.stringify(errorData)}\n\n`);
        response.write(`event: close\ndata: ${JSON.stringify({ reason: "validation_error" })}\n\n`);
        response.end();
      }
    } else {
      logger.error("Error processing question", error);

      if (!isStreaming) {
        // Send regular HTTP error response if not streaming yet
        const errorResponse: ErrorResponse = {
          success: false,
          error: "Failed to process question",
        };
        response.status(500).send(errorResponse);
      } else {
        // Send SSE error event if already streaming
        const errorData = {
          success: false,
          error: "Failed to process question",
        };
        response.write(`event: error\ndata: ${JSON.stringify(errorData)}\n\n`);
        response.write(`event: close\ndata: ${JSON.stringify({ reason: "processing_error" })}\n\n`);
        response.end();
      }
    }

    isStreaming = false;
  }
});
