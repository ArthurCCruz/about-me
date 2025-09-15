# Arthur Cruz Career API

A serverless TypeScript API that answers questions specifically about Arthur Cruz's career using OpenAI and stores interactions in DynamoDB.

## Features

- 🤖 OpenAI-powered answers about Arthur Cruz's career
- 📊 DynamoDB storage for all interactions
- 🚀 Serverless architecture with AWS Lambda
- 🔒 Input validation and error handling
- 📝 TypeScript for type safety
- 🌐 CORS-enabled for web applications

## Prerequisites

- Node.js 18+ 
- AWS CLI configured
- Serverless Framework
- OpenAI API key

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   export OPENAI_API_KEY="your-openai-api-key-here"
   ```

3. **Install Serverless Framework globally (if not already installed):**
   ```bash
   npm install -g serverless
   ```

## Development

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Run locally with Serverless Offline:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

## Deployment

1. **Deploy to AWS:**
   ```bash
   npm run deploy
   ```

2. **Deploy to a specific stage:**
   ```bash
   serverless deploy --stage production
   ```

## API Usage

### POST /career-question

Submit a question about Arthur Cruz's career and receive AI-generated answers based on his professional background.

**Request Body:**
```json
{
  "question": "What is Arthur Cruz's background in software development?",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "id": "uuid-generated-id",
  "question": "What is Arthur Cruz's background in software development?",
  "answer": "Arthur Cruz has extensive experience in software development...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "userId": "optional-user-id"
}
```

**Example with curl:**
```bash
curl -X POST https://your-api-gateway-url/career-question \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are Arthur Cruz's key achievements in his career?",
    "userId": "user123"
  }'
```

## Architecture

- **Lambda Function**: Handles HTTP requests and orchestrates the flow
- **OpenAI API**: Generates answers about Arthur Cruz's career using GPT-3.5-turbo
- **DynamoDB**: Stores all question-answer pairs with TTL (30 days)
- **API Gateway**: Provides HTTP endpoint with CORS support

## Data Storage

All interactions are stored in DynamoDB with the following structure:
- `id`: Unique identifier (UUID)
- `question`: User's question
- `answer`: AI-generated response
- `createdAt`: Timestamp of interaction
- `userId`: Optional user identifier
- `ttl`: Time-to-live (30 days)

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created (successful question-answer generation)
- `400`: Bad Request (validation errors)
- `500`: Internal Server Error

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DYNAMODB_TABLE`: DynamoDB table name (auto-generated)

## Project Structure

```
src/
├── handlers/
│   └── careerQuestion.ts    # Main Lambda handler
├── services/
│   ├── dynamodb.ts          # DynamoDB operations
│   └── openai.ts           # OpenAI integration
├── types/
│   └── index.ts            # TypeScript interfaces
└── utils/
    ├── response.ts         # Response formatting
    └── validation.ts       # Input validation
```

## License

MIT License
