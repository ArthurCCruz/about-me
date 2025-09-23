# About Me - AI-Powered Personal Assistant

A sophisticated Firebase Cloud Functions-based API that provides real-time, AI-powered responses about Arthur Cruz's professional background, experience, and expertise. Built with TypeScript, OpenAI GPT integration, and Server-Sent Events (SSE) for seamless streaming responses.

## 🚀 Features

### 🤖 **AI-Powered Responses**
- **OpenAI GPT Integration**: Leverages OpenAI's advanced language models for intelligent, contextual responses
- **Real-time Streaming**: Server-Sent Events (SSE) implementation for live response streaming
- **Context-Aware**: Maintains conversation history for coherent, contextual interactions
- **Professional Voice**: Customized system prompts to maintain Arthur's authentic professional voice

### 📊 **Advanced Architecture**
- **Type-Safe Development**: Full TypeScript implementation with strict type checking
- **Clean Architecture**: Modular design with separated concerns (services, handlers, types, DTOs)
- **Dependency Injection**: Service-based architecture for maintainable and testable code
- **Environment Configuration**: Centralized configuration management for different environments

### 🔒 **Enterprise-Grade Security & Validation**
- **Input Validation**: Class-validator integration with custom DTOs for robust data validation
- **User Session Tracking**: IP address and User-Agent based session management
- **Firebase Security**: Firestore rules and Firebase Admin SDK for secure data operations
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

### 💾 **Data Management**
- **Firestore Integration**: Cloud Firestore for persistent message storage and conversation history
- **Message History**: Configurable conversation history limits with efficient querying
- **Session Management**: User identification and session tracking across requests
- **Data Persistence**: Complete conversation logging for analytics and debugging

### ⚡ **Performance & Reliability**
- **Streaming Optimization**: Efficient SSE implementation with heartbeat monitoring
- **Connection Management**: Automatic timeout handling and connection cleanup
- **Error Recovery**: Graceful error handling with proper client notifications
- **Resource Management**: Proper cleanup of timeouts and connections

## 🏗️ Architecture

### **Core Components**

```
src/
├── handlers/           # HTTP request handlers
│   └── sendMessage.ts  # Main streaming endpoint
├── services/           # Business logic services
│   ├── openaiService.ts    # OpenAI integration & streaming
│   ├── messageService.ts   # Firestore operations
│   └── firebase.ts         # Firebase configuration
├── types/              # TypeScript type definitions
│   ├── message.ts          # Message & response types
│   ├── user.ts             # User & session types
│   └── index.ts            # Type exports
├── dto/                # Data Transfer Objects
│   └── message.dto.ts      # Input validation schemas
├── utils/              # Utility functions
│   ├── validation.ts       # Validation utilities
│   └── session.ts          # Session management
├── config/             # Configuration management
└── assets/             # Static resources
    └── arthur-cruz.md      # Professional background data
```

### **Technology Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 22 | JavaScript runtime |
| **Language** | TypeScript | Type-safe development |
| **Framework** | Firebase Functions v2 | Serverless backend |
| **Database** | Cloud Firestore | NoSQL document storage |
| **AI** | OpenAI GPT API | Natural language processing |
| **Validation** | class-validator | Input validation |
| **Streaming** | Server-Sent Events | Real-time communication |

## 🔧 Key Services

### **OpenAI Service**
- **Streaming Responses**: Real-time token streaming from OpenAI API
- **Context Management**: Maintains conversation context and history
- **Prompt Engineering**: Custom system prompts for professional responses
- **Error Handling**: Robust error handling for API failures

### **Message Service**
- **CRUD Operations**: Complete message lifecycle management
- **History Tracking**: Efficient conversation history retrieval
- **Session Management**: User-specific message filtering
- **Data Validation**: Type-safe data operations

### **Validation System**
- **DTO Validation**: Structured input validation using decorators
- **Error Messages**: Clear, actionable error responses
- **Type Safety**: Compile-time and runtime type checking
- **Security**: Input sanitization and validation

## 📡 API Features

### **Streaming Response Format**
The API uses Server-Sent Events (SSE) with structured event types:

```typescript
// Message ID Event
event: message-id
data: {"messageId": "document-id"}

// Content Chunk Event
event: chunk
data: {
  "success": true,
  "messageId": "document-id",
  "chunk": "partial response text",
  "isComplete": false
}

// Heartbeat Event
event: heartbeat
data: {
  "timestamp": 1234567890,
  "chunkCount": 10,
  "messageId": "document-id"
}

// Completion Event
event: complete
data: {
  "success": true,
  "messageId": "document-id",
  "chunk": "",
  "isComplete": true
}

// Stream Termination
event: close
data: {"reason": "stream_complete"}
```

### **Error Handling**
- **Validation Errors**: Structured validation error responses
- **Streaming Errors**: Graceful error handling during streaming
- **Connection Errors**: Automatic cleanup on client disconnect
- **Timeout Protection**: 5-minute stream timeout with proper cleanup

## 🎯 Professional Background Integration

The system is pre-configured with Arthur Cruz's comprehensive professional background, including:

- **Career Journey**: From Civil Engineering to Software Development
- **Technical Expertise**: Full-stack development, AWS, GraphQL, TypeScript
- **Leadership Experience**: Tech Lead roles and team management
- **Industry Experience**: ERP, Supply Chain, Financial Services, Agricultural Insurance
- **Key Achievements**: Platform architecture, SaaS development, process automation

## 🔐 Security Features

- **Firebase Admin SDK**: Secure server-side operations
- **Input Validation**: Comprehensive input sanitization
- **Session Tracking**: User identification without authentication overhead
- **Error Sanitization**: Safe error messages without sensitive data exposure
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📊 Monitoring & Logging

- **Structured Logging**: Comprehensive logging with Firebase Functions logger
- **Performance Tracking**: Chunk counting and timing metrics
- **Error Tracking**: Detailed error logging with context
- **User Analytics**: Session tracking and usage patterns

## 🚀 Deployment

The project is configured for Firebase deployment with:
- **Automated Builds**: TypeScript compilation and asset copying
- **Linting**: ESLint integration with Google style guide
- **Pre-deployment Checks**: Automated testing and validation
- **Environment Management**: Separate configurations for development and production

---

*This project demonstrates modern serverless architecture, real-time communication, and AI integration best practices for creating intelligent, responsive APIs.*
