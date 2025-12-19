# AINOZ Relayer Service

Backend relayer service for AINOZ LLM.

## Running

### Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm run start
```

The service will start on port 3001.

## Endpoints

### POST /v1/generate

Non-streaming text generation.

**Request:**
```json
{
  "model": "default",
  "prompt": "Hello",
  "wallet": "optional-wallet-address"
}
```

**Response:**
```json
{
  "text": "Generated text response",
  "requestId": "unique-request-id"
}
```

### POST /v1/generate/stream

Streaming text generation.

**Request:** Same as `/v1/generate`

**Response:** Server-sent events stream of text chunks

## Configuration

The service is currently a stub implementation. In production, you would:
- Add authentication middleware
- Integrate with actual LLM inference backend
- Add request logging and monitoring
- Implement rate limiting
- Add caching layer
