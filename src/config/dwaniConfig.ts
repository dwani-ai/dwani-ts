import axios, { AxiosInstance } from 'axios';

export class DwaniAPIError extends Error {
  public status?: number;
  public code?: string;
  public data?: any;

  constructor(error: { message: string; status?: number; code?: string; data?: any }) {
    super(error.message || `API error: ${error.data?.error || 'Unknown error'}`);
    this.name = 'DwaniAPIError';
    this.status = error.status;
    this.code = error.code;
    this.data = error.data;
  }
}

export class DwaniConfig {
  private apiKey: string | null;
  private apiBase: string;
  public client: AxiosInstance;

  constructor(apiKey?: string, apiBase?: string) {
    this.apiKey = apiKey || process.env.DWANI_API_KEY || null;
    this.apiBase = apiBase || process.env.DWANI_API_BASE_URL || '';
    this.client = axios.create({
      baseURL: this.apiBase,
      headers: { 'X-API-KEY': this.apiKey || '' },
    });
  }

  public validate(): void {
    if (!this.apiKey) {
      throw new Error('DWANI_API_KEY is not set in environment variables or constructor');
    }
    if (!this.apiBase) {
      throw new Error('DWANI_API_BASE_URL is not set in environment variables or constructor');
    }
    try {
      new URL(this.apiBase);
    } catch {
      throw new Error(`Invalid DWANI_API_BASE_URL: ${this.apiBase}`);
    }
  }

  public headers(): Record<string, string> {
    return { 'X-API-KEY': this.apiKey || '' };
  }
}