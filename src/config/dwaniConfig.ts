import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export class DwaniAPIError extends Error {
  constructor(response: any) {
    super(`API error: ${response?.data?.error || 'Unknown error'}`);
    this.name = 'DwaniAPIError';
  }
}

export class DwaniConfig {
  private apiKey: string | null;
  private apiBase: string;
  public client: AxiosInstance;

  constructor() {
    this.apiKey = process.env.DWANI_API_KEY || null;
    this.apiBase = process.env.DWANI_API_BASE_URL || 'https://dwani.aip.dwani.123';
    this.client = axios.create({
      baseURL: this.apiBase,
      headers: {
        'X-API-KEY': this.apiKey || '',
        'Content-Type': 'application/json',
      },
    });
  }

  public validate(): void {
    if (!this.apiKey) {
      throw new Error('DWANI_API_KEY is not set in environment variables');
    }
    if (!this.apiBase) {
      throw new Error('DWANI_API_BASE_URL is not set in environment variables');
    }
  }

  public headers(): Record<string, string> {
    return {
      'X-API-KEY': this.apiKey || '',
      'Content-Type': 'application/json',
    };
  }
}