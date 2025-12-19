# ainoz-sdk

Official TypeScript SDK for AINOZ LLM.

## Installation

```bash
npm install ainoz-sdk
```

## Usage

```typescript
import { AinozClient } from 'ainoz-sdk';

const client = new AinozClient({
  relayerUrl: 'http://localhost:3001',
  apiKey: 'your-api-key'
});

// Generate text
const response = await client.generateText({
  model: 'default',
  prompt: 'Hello, world!'
});

console.log(response.text);

// Stream generation
const stream = client.streamGenerate({
  model: 'default',
  prompt: 'Tell me a story'
});

stream.on('data', (chunk) => console.log(chunk));
stream.on('end', () => console.log('Done'));
stream.on('error', (err) => console.error(err));
```

## API

### AinozClient

Constructor options:
- `relayerUrl` (required): URL of the AINOZ relayer service
- `apiKey` (optional): API key for authentication
- `timeoutMs` (optional): Request timeout in milliseconds (default: 30000)

### Methods

#### generateText(params)

Generate text using non-streaming API.

Parameters:
- `model`: Model identifier
- `prompt`: Input prompt
- `wallet` (optional): Solana wallet address

Returns: `Promise<GenerateTextResponse>`

#### streamGenerate(params)

Generate text using streaming API.

Parameters: Same as `generateText`

Returns: `EventEmitter` with events:
- `data`: Streaming chunks
- `end`: Stream completion
- `error`: Error events

## License

MIT
