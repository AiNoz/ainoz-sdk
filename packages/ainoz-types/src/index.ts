export interface RelayerRequest {
  model: string;
  prompt: string;
  wallet?: string;
}

export interface RelayerResponse {
  text: string;
  requestId: string;
}

export interface StreamChunk {
  data: string;
}
