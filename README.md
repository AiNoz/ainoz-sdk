# AINOZ LLM

**AINOZ** is an on-chain LLM utility designed for the Solana ecosystem.

## Features

- 🚀 Production-ready TypeScript SDK
- 🔗 Solana blockchain integration
- 📡 Streaming and non-streaming API support
- 🛡️ Type-safe with strict TypeScript
- 📦 Modular monorepo architecture

## Quick Start

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run relayer service
npm run dev

# Run examples
npm run --workspace @ainoz/examples-node start
npm run --workspace @ainoz/examples-streaming start
```

## Repository Structure

- **apps/landing** - Marketing landing page
- **apps/docs** - Documentation site
- **packages/ainoz-sdk** - TypeScript SDK (npm-publishable)
- **packages/ainoz-types** - Shared type definitions
- **services/relayer** - Backend relayer service
- **examples/** - Usage examples

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
AINOZ_API_KEY=your_api_key_here
AINOZ_RELAYER_URL=http://localhost:3001
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## SDK Installation

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

const response = await client.generateText({
  model: 'default',
  prompt: 'Hello, world!'
});

console.log(response.text);
```

## Documentation

See [apps/docs](./apps/docs) for detailed documentation.

## License

MIT
