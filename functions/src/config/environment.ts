export interface EnvironmentConfig {
  // OpenAI Configuration
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };

  // Application Configuration
  app: {
    messageHistoryLimit: number;
    nodeEnv: string;
  };
}

/**
 * Validates and returns environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const requiredEnvVars = ["OPENAI_API_KEY"];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }

  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || "",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      maxTokens: parseInt(process.env.MAX_TOKENS || "200", 10),
      temperature: parseFloat(process.env.TEMPERATURE || "0.7"),
    },
    app: {
      messageHistoryLimit: parseInt(process.env.MESSAGE_HISTORY_LIMIT || "20", 10),
      nodeEnv: process.env.NODE_ENV || "development",
    },
  };
}
