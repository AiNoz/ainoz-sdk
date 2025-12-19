import { EventEmitter } from 'events';
import type {
  AinozClientOptions,
  GenerateTextParams,
  GenerateTextResponse,
} from './types';
import { AinozNetworkError, AinozValidationError } from './errors';

export class AinozClient {
  private readonly relayerUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;

  constructor(options: AinozClientOptions) {
    if (!options.relayerUrl) {
      throw new AinozValidationError('relayerUrl is required');
    }

    try {
      new URL(options.relayerUrl);
    } catch {
      throw new AinozValidationError('relayerUrl must be a valid URL');
    }

    this.relayerUrl = options.relayerUrl.replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? 30000;
  }

  async generateText(params: GenerateTextParams): Promise<GenerateTextResponse> {
    this.validateGenerateParams(params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.relayerUrl}/v1/generate`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new AinozNetworkError(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.text || !data.requestId) {
        throw new AinozNetworkError('Invalid response format from relayer');
      }

      return {
        text: data.text,
        requestId: data.requestId,
      };
    } catch (error) {
      if (error instanceof AinozNetworkError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AinozNetworkError(
            `Request timeout after ${this.timeoutMs}ms`
          );
        }
        throw new AinozNetworkError(`Request failed: ${error.message}`);
      }

      throw new AinozNetworkError('Unknown error occurred');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  streamGenerate(params: GenerateTextParams): EventEmitter {
    this.validateGenerateParams(params);

    const emitter = new EventEmitter();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const executeStream = async (): Promise<void> => {
      try {
        const response = await fetch(`${this.relayerUrl}/v1/generate/stream`, {
          method: 'POST',
          headers: this.buildHeaders(),
          body: JSON.stringify(params),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new AinozNetworkError(
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        if (!response.body) {
          throw new AinozNetworkError('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            emitter.emit('end');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          emitter.emit('data', chunk);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            emitter.emit(
              'error',
              new AinozNetworkError(`Stream timeout after ${this.timeoutMs}ms`)
            );
          } else {
            emitter.emit('error', error);
          }
        } else {
          emitter.emit('error', new Error('Unknown streaming error'));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };

    executeStream();

    return emitter;
  }

  private validateGenerateParams(params: GenerateTextParams): void {
    if (!params.model || typeof params.model !== 'string') {
      throw new AinozValidationError('model must be a non-empty string');
    }

    if (!params.prompt || typeof params.prompt !== 'string') {
      throw new AinozValidationError('prompt must be a non-empty string');
    }

    if (params.wallet !== undefined && typeof params.wallet !== 'string') {
      throw new AinozValidationError('wallet must be a string');
    }
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }
}
