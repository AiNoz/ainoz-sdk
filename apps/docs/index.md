# AINOZ LLM Documentation

Welcome to the AINOZ LLM documentation.

## What is AINOZ?

AINOZ is an on-chain LLM utility designed specifically for the Solana ecosystem. It provides a production-ready TypeScript SDK that allows developers to integrate AI capabilities into their Solana applications.

### Key Features

- **Production Ready**: Built with TypeScript strict mode, comprehensive error handling
- **Solana Native**: Deep integration with Solana wallet and blockchain
- **Streaming Support**: Real-time streaming and traditional request/response patterns
- **Type Safe**: Full TypeScript definitions with no implicit any
- **Modular**: Clean monorepo architecture with reusable packages

## Installation

### SDK Installation

```bash
npm install ainoz-sdk
# or
yarn add ainoz-sdk
```

### From Source

```bash
git clone https://github.com/yourusername/ainoz.git
cd ainoz
npm install
npm run build
```

## Quick Start

### Basic Usage

```typescript
import { AinozClient } from 'ainoz-sdk';

const client = new AinozClient({
  relayerUrl: 'http://localhost:3001',
  apiKey: 'your-api-key', // optional
  timeoutMs: 30000 // optional, default 30s
});

const response = await client.generateText({
  model: 'default',
  prompt: 'Explain Solana in simple terms',
  wallet: 'YourSolanaWalletAddress' // optional
});

console.log(response.text);
console.log(response.requestId);
```

### Streaming Usage

```typescript
import { AinozClient } from 'ainoz-sdk';

const client = new AinozClient({
  relayerUrl: 'http://localhost:3001'
});

const stream = client.streamGenerate({
  model: 'default',
  prompt: 'Write a haiku about Solana'
});

stream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

stream.on('end', () => {
  console.log('\n\nStream completed');
});

stream.on('error', (error) => {
  console.error('Stream error:', error);
});
```

## API Reference

### AinozClient

#### Constructor

```typescript
constructor(options: AinozClientOptions)
```

**AinozClientOptions:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| relayerUrl | string | Yes | - | URL of the AINOZ relayer service |
| apiKey | string | No | - | API key for authentication |
| timeoutMs | number | No | 30000 | Request timeout in milliseconds |

#### generateText()

Generate text using non-streaming API.

```typescript
async generateText(params: GenerateTextParams): Promise<GenerateTextResponse>
```

**GenerateTextParams:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | Yes | Model identifier |
| prompt | string | Yes | Input prompt |
| wallet | string | No | Solana wallet address |

**GenerateTextResponse:**

| Field | Type | Description |
|-------|------|-------------|
| text | string | Generated text |
| requestId | string | Unique request identifier |

#### streamGenerate()

Generate text using streaming API.

```typescript
streamGenerate(params: GenerateTextParams): EventEmitter
```

Returns an EventEmitter that emits:
- `'data'` - Streaming text chunks (string)
- `'end'` - Stream completion
- `'error'` - Errors (Error)

## Environment Variables

Create a `.env` file in your project root:

```bash
AINOZ_API_KEY=your_api_key_here
AINOZ_RELAYER_URL=http://localhost:3001
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Variable Descriptions

- **AINOZ_API_KEY**: Your AINOZ API key (obtain from dashboard)
- **AINOZ_RELAYER_URL**: URL of the relayer service
- **SOLANA_RPC_URL**: Solana RPC endpoint URL

## Running the Relayer

The relayer service must be running for the SDK to work:

```bash
cd services/relayer
npm install
npm run dev
```

The relayer will start on `http://localhost:3001`.

### Relayer Endpoints

- `POST /v1/generate` - Non-streaming text generation
- `POST /v1/generate/stream` - Streaming text generation

## Examples

### Example 1: Basic Text Generation

```typescript
import { AinozClient } from 'ainoz-sdk';

async function main() {
  const client = new AinozClient({
    relayerUrl: process.env.AINOZ_RELAYER_URL || 'http://localhost:3001',
    apiKey: process.env.AINOZ_API_KEY
  });

  const result = await client.generateText({
    model: 'default',
    prompt: 'What makes Solana unique?'
  });

  console.log('Generated:', result.text);
  console.log('Request ID:', result.requestId);
}

main().catch(console.error);
```

### Example 2: Streaming with Progress

```typescript
import { AinozClient } from 'ainoz-sdk';

async function streamExample() {
  const client = new AinozClient({
    relayerUrl: 'http://localhost:3001'
  });

  console.log('Generating...\n');

  const stream = client.streamGenerate({
    model: 'default',
    prompt: 'List 5 benefits of using Solana'
  });

  stream.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  stream.on('end', () => {
    console.log('\n\nGeneration complete!');
  });

  stream.on('error', (err) => {
    console.error('Error:', err.message);
  });
}

streamExample().catch(console.error);
```

## Error Handling

The SDK throws typed errors:

```typescript
import { AinozClient, AinozError } from 'ainoz-sdk';

try {
  const client = new AinozClient({
    relayerUrl: 'http://localhost:3001'
  });
  
  const result = await client.generateText({
    model: 'default',
    prompt: 'Hello'
  });
} catch (error) {
  if (error instanceof AinozError) {
    console.error('AINOZ Error:', error.message);
    console.error('Code:', error.code);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Best Practices

1. **Always set timeouts** for production applications
2. **Handle errors** gracefully with try/catch
3. **Use environment variables** for configuration
4. **Implement retry logic** for network failures
5. **Monitor request IDs** for debugging
6. **Close streams** properly to avoid memory leaks

## Troubleshooting

### SDK cannot connect to relayer

Ensure the relayer service is running:
```bash
npm run dev
```

### TypeScript errors

Ensure you're using TypeScript 5.0+:
```bash
npm install -D typescript@^5.3.3
```

### Streaming not working

Check that the relayer `/v1/generate/stream` endpoint is accessible and returning proper streaming responses.

## Support

- GitHub Issues: [github.com/yourusername/ainoz/issues](https://github.com/yourusername/ainoz/issues)
- Documentation: [github.com/yourusername/ainoz](https://github.com/yourusername/ainoz)

## License

MIT
