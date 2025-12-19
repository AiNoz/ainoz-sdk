import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface GenerateRequest {
  model: string;
  prompt: string;
  wallet?: string;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateStubResponse(prompt: string): string {
  return `[STUB RESPONSE] You asked: "${prompt}". This is a placeholder response from the AINOZ relayer. In production, this would be replaced with actual LLM inference.`;
}

app.post('/v1/generate', (req: Request, res: Response) => {
  try {
    const { model, prompt } = req.body as GenerateRequest;

    if (!model || !prompt) {
      res.status(400).json({
        error: 'Missing required fields: model and prompt',
      });
      return;
    }

    const requestId = generateRequestId();
    const text = generateStubResponse(prompt);

    res.json({
      text,
      requestId,
    });
  } catch (error) {
    console.error('Error in /v1/generate:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

app.post('/v1/generate/stream', (req: Request, res: Response) => {
  try {
    const { model, prompt } = req.body as GenerateRequest;

    if (!model || !prompt) {
      res.status(400).json({
        error: 'Missing required fields: model and prompt',
      });
      return;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const response = generateStubResponse(prompt);
    const words = response.split(' ');

    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        const chunk = index === 0 ? words[index] : ` ${words[index]}`;
        res.write(chunk);
        index++;
      } else {
        clearInterval(interval);
        res.end();
      }
    }, 50);

    req.on('close', () => {
      clearInterval(interval);
    });
  } catch (error) {
    console.error('Error in /v1/generate/stream:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 AINOZ Relayer running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/v1/generate`);
  console.log(`   POST http://localhost:${PORT}/v1/generate/stream`);
  console.log(`   GET  http://localhost:${PORT}/health`);
});
