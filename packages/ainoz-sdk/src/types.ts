export interface AinozClientOptions {
  relayerUrl: string;
  apiKey?: string;
  timeoutMs?: number;
}

export interface GenerateTextParams {
  model: string;
  prompt: string;
  wallet?: string;
}

export interface GenerateTextResponse {
  text: string;
  requestId: string;
}
