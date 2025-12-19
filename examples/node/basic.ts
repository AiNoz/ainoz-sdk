import { AinozClient } from 'ainoz-sdk';

async function main(): Promise<void> {
  console.log('🚀 AINOZ SDK - Basic Example\n');

  const client = new AinozClient({
    relayerUrl: process.env.AINOZ_RELAYER_URL || 'http://localhost:3001',
    apiKey: process.env.AINOZ_API_KEY,
    timeoutMs: 30000,
  });

  try {
    console.log('📝 Generating text...\n');

    const response = await client.generateText({
      model: 'default',
      prompt: 'Explain what Solana is in one sentence',
      wallet: 'ExampleWalletAddress123',
    });

    console.log('✅ Generated Text:');
    console.log(response.text);
    console.log('\n📋 Request ID:', response.requestId);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
