import { randomBytes } from "crypto";
import { Request } from "firebase-functions/https";

export const generateSessionId = (): string => {
  return randomBytes(16).toString("hex");
};

export const extractClientInfo = (request: Request): { ipAddress: string; userAgent: string } => {
  // Firebase Functions v2 request object structure
  const forwardedFor = request.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor) ?
    forwardedFor[0]?.trim() :
    forwardedFor?.split(",")[0]?.trim();

  const getHeaderValue = (header: string | string[] | undefined): string | undefined => {
    return Array.isArray(header) ? header[0] : header;
  };

  const ipAddress = request.ip ||
    forwardedIp ||
    getHeaderValue(request.headers["x-real-ip"]) ||
    getHeaderValue(request.headers["x-client-ip"]) ||
    getHeaderValue(request.headers["cf-connecting-ip"]) || // Cloudflare
    getHeaderValue(request.headers["x-cluster-client-ip"]) ||
    "127.0.0.1"; // Default to localhost for emulator

  const userAgentHeader = request.headers["user-agent"] || request.headers["User-Agent"];
  const userAgent = Array.isArray(userAgentHeader) ? userAgentHeader[0] : userAgentHeader || "unknown";

  return { ipAddress, userAgent };
};
