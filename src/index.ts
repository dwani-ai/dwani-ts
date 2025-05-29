import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

// Interfaces for request parameters
export interface ChatRequest {
  prompt: string;
  src_lang: string;
  tgt_lang: string;
}

export interface VisionRequest {
  file_path: string;
  query: string;
  src_lang: string;
  tgt_lang: string;
}

export interface ASRRequest {
  file_path: string;
  language: string;
}

export interface TTSRequest {
  input: string;
  response_format?: 'mp3' | 'wav';
}

export interface TranslateRequest {
  sentences: string[];
  src_lang: string;
  tgt_lang: string;
}

export interface DocumentsRequest {
  file_path: string;
  page_number: number;
  src_lang: string;
  tgt_lang: string;
}

// Interface for API responses (generic, as exact response shape may vary)
export interface ApiResponse {
  [key: string]: any;
}

// Configuration class
class DwaniConfig {
  private apiKey: string | null;
  private apiBase: string;
  public client: AxiosInstance;

  constructor() {
    this.apiKey = process.env.DWANI_API_KEY || null;
    this.apiBase = process.env.DWANI_API_BASE_URL || 'https://dwani.aip.dwani.123';
    this.client = axios.create({
      baseURL: this.apiBase,
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  // Validate configuration
  public validate(): void {
    if (!this.apiKey) {
      throw new Error('DWANI_API_KEY is not set in environment variables');
    }
    if (!this.apiBase) {
      throw new Error('DWANI_API_BASE_URL is not set in environment variables');
    }
  }
}

// Chat module
class Chat {
  constructor(private config: DwaniConfig) {}

  /**
   * Sends a chat prompt to the Dwani API
   * @param params Chat request parameters
   * @returns API response
   */
  public async create(params: ChatRequest): Promise<ApiResponse> {
    this.config.validate();
    try {
      const response = await this.config.client.post('/v1/indic_chat', params);
      return response.data;
    } catch (error: any) {
      throw new Error(`Chat API error: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Vision module
class Vision {
  constructor(private config: DwaniConfig) {}

  /**
   * Generates a caption for an image
   * @param params Vision request parameters
   * @returns API response
   */
  public async caption(params: VisionRequest): Promise<ApiResponse> {
    this.config.validate();
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path));
      form.append('query', params.query);
      form.append('src_lang', params.src_lang);
      form.append('tgt_lang', params.tgt_lang);

      const response = await this.config.client.post('/vision/caption', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Vision API error: ${error.response?.data?.error || error.message}`);
    }
  }
}

// ASR (Automatic Speech Recognition) module
class ASR {
  constructor(private config: DwaniConfig) {}

  /**
   * Transcribes audio to text
   * @param params ASR request parameters
   * @returns API response
   */
  public async transcribe(params: ASRRequest): Promise<ApiResponse> {
    this.config.validate();
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path));
      form.append('language', params.language);

      const response = await this.config.client.post('/asr/transcribe', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`ASR API error: ${error.response?.data?.error || error.message}`);
    }
  }
}

// TTS (Text-to-Speech) module
class Audio {
  constructor(private config: DwaniConfig) {}

  /**
   * Converts text to speech
   * @param params TTS request parameters
   * @returns Binary audio data
   */
  public async speech(params: TTSRequest): Promise<Buffer> {
    this.config.validate();
    try {
      const response = await this.config.client.post('/audio/speech', params, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error: any) {
      throw new Error(`TTS API error: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Translation module
class Translate {
  constructor(private config: DwaniConfig) {}

  /**
   * Translates sentences between languages
   * @param params Translation request parameters
   * @returns API response
   */
  public async run_translate(params: TranslateRequest): Promise<ApiResponse> {
    this.config.validate();
    try {
      const response = await this.config.client.post('/translate', params);
      return response.data;
    } catch (error: any) {
      throw new Error(`Translate API error: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Documents module
class Documents {
  constructor(private config: DwaniConfig) {}

  /**
   * Extracts text from documents
   * @param params Documents request parameters
   * @returns API response
   */
  public async run_extract(params: DocumentsRequest): Promise<ApiResponse> {
    this.config.validate();
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path));
      form.append('page_number', params.page_number.toString());
      form.append('src_lang', params.src_lang);
      form.append('tgt_lang', params.tgt_lang);

      const response = await this.config.client.post('/documents/extract', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Documents API error: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Main Dwani client
class Dwani {
  public Chat: Chat;
  public Vision: Vision;
  public ASR: ASR;
  public Audio: Audio;
  public Translate: Translate;
  public Documents: Documents;

  constructor() {
    const config = new DwaniConfig();
    this.Chat = new Chat(config);
    this.Vision = new Vision(config);
    this.ASR = new ASR(config);
    this.Audio = new Audio(config);
    this.Translate = new Translate(config);
    this.Documents = new Documents(config);
  }
}

export default new Dwani();