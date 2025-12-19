import { AinozClient, AinozError } from 'ainoz-sdk';

async function main(): Promise<void> {
  console.log('🌊 AINOZ SDK - Streaming Example\n');

  const client = new AinozClient({
    relayerUrl: process.env.AINOZ_RELAYER_URL || 'http://localhost:3001',
    apiKey: process.env.AINOZ_API_KEY,
  });

  console.log('📝 Starting stream generation...\n');

  const stream = client.streamGenerate({
    model: 'default',
    prompt: 'List 5 key features of the Solana blockchain',
  });

  stream.on('data', (chunk: string) => {
    process.stdout.write(chunk);
  });

  stream.on('end', () => {
    console.log('\n\n✅ Stream completed successfully!');
  });

  stream.on('error', (error: Error) => {
    if (error instanceof AinozError) {
      console.error('\n❌ AINOZ Error:', error.message);
      console.error('   Code:', error.code);
    } else {
      console.error('\n❌ Error:', error.message);
    }
    process.exit(1);
  });
}

main();
