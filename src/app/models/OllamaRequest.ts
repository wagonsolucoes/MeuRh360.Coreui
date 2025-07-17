export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  lenght: number;
  temperature: number;
}