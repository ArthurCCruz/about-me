import OpenAI from "openai";
import { OpenAIMessage } from "../types/message";
import { getEnvironmentConfig } from "../config/environment";
import * as fs from "fs";
import * as path from "path";

export class OpenAIService {
  private openai: OpenAI;
  private config: ReturnType<typeof getEnvironmentConfig>;

  constructor() {
    this.config = getEnvironmentConfig();

    this.openai = new OpenAI({
      apiKey: this.config.openai.apiKey,
    });
  }

  /**
   * Generates streaming AI response about Arthur Cruz based on question and context.
   * @param question - The user's question
   * @param conversationHistory - Previous conversation messages
   * @return Streaming response
   */
  async generateStreamingResponse(
    question: string,
    conversationHistory: OpenAIMessage[] = []
  ) {
    const systemPrompt = this.buildSystemPrompt();
    const contextPrompt = this.buildContextPrompt();

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "system" as const, content: contextPrompt },
      ...conversationHistory,
      { role: "user" as const, content: question },
    ];

    const stream = await this.openai.chat.completions.create({
      model: this.config.openai.model,
      messages,
      max_tokens: this.config.openai.maxTokens,
      temperature: this.config.openai.temperature,
      stream: true,
    });

    return stream;
  }

  private buildSystemPrompt(): string {
    return `You are an AI assistant representing Arthur Cruz, a software engineer and technical leader. 
Your role is to answer questions about Arthur's career, experience, skills, and professional background.

Key guidelines:
- Always be professional and authentic to Arthur's voice
- Provide specific examples from his experience when relevant
- If asked about something not in Arthur's background, politely redirect to relevant topics
- Keep responses concise but informative
- Never use markdown formatting in your responses, always use plain text
- Use Arthur's actual experience and achievements to answer questions
- Be helpful and engaging while maintaining professionalism`;
  }

  private buildContextPrompt(): string {
    const resumePath = path.join(__dirname, "../assets/arthur-cruz.md");

    try {
      const resumeContent = fs.readFileSync(resumePath, "utf8");

      return `
Arthur Cruz's Resume:
${resumeContent}`;
    } catch (error) {
      console.error("Error reading resume file:", error);
      return `
Note: Resume file not found. Please ensure the markdown file is included in the build.`;
    }
  }
}

export const openaiService = new OpenAIService();
