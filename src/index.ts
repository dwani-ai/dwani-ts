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

export interface VisionRequest {
  file_path: string;
  query?: string;
  src_lang?: string;
  tgt_lang?: string;
}

// Interface for API responses (generic, as exact response shape may vary)
export interface ApiResponse {
  [key: string]: any;
}

// Language options mapping
const languageOptions: { name: string; code: string }[] = [
  { name: "English", code: "eng_Latn" },
  { name: "Kannada", code: "kan_Knda" },
  { name: "Hindi", code: "hin_Deva" },
  { name: "Assamese", code: "asm_Beng" },
  { name: "Bengali", code: "ben_Beng" },
  { name: "Gujarati", code: "guj_Gujr" },
  { name: "Malayalam", code: "mal_Mlym" },
  { name: "Marathi", code: "mar_Deva" },
  { name: "Odia", code: "ory_Orya" },
  { name: "Punjabi", code: "pan_Guru" },
  { name: "Tamil", code: "tam_Taml" },
  { name: "Telugu", code: "tel_Telu" },
  { name: "German", code: "deu_Latn" },
];

// Create dictionaries for language name to code and code to code mapping
const langNameToCode: Record<string, string> = {};
const langCodeToCode: Record<string, string> = {};

languageOptions.forEach(({ name, code }) => {
  langNameToCode[name.toLowerCase()] = code;
  langCodeToCode[code] = code;
});

function normalizeLanguage(lang: string): string {
  const langNormalized = lang.trim();
  const langLower = langNormalized.toLowerCase();

  // Check if input is a language name (case-insensitive)
  if (langNameToCode[langLower]) {
    return langNameToCode[langLower];
  }

  // Check if input is a language code
  if (langCodeToCode[langNormalized]) {
    return langCodeToCode[langNormalized];
  }

  // Raise error if language is not supported
  const supportedLangs = [
    ...Object.keys(langNameToCode),
    ...Object.keys(langCodeToCode),
  ];
  throw new Error(
    `Unsupported language: ${lang}. Supported languages: ${supportedLangs.join(', ')}`
  );
}

class DwaniAPIError extends Error {
  constructor(response: any) {
    super(`API error: ${response?.data?.error || 'Unknown error'}`);
    this.name = 'DwaniAPIError';
  }
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
        'X-API-KEY': this.apiKey || '',
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

  // Headers method to match Python's client._headers()
  public headers(): Record<string, string> {
    return {
      'X-API-KEY': this.apiKey || '',
      'Content-Type': 'application/json',
    };
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
    // Normalize languages
    const normalizedParams = {
      ...params,
      src_lang: normalizeLanguage(params.src_lang),
      tgt_lang: normalizeLanguage(params.tgt_lang),
    };
    try {
      const response = await this.config.client.post('/v1/indic_chat', normalizedParams);
      return response.data;
    } catch (error: any) {
      throw new DwaniAPIError(error.response || error);
    }
  }
}

// Vision module
export class Vision {
  constructor(private config: DwaniConfig) {}

  /**
   * Generates a caption for an image
   * @param params Vision request parameters
   * @returns API response
   */
  public async caption(params: VisionRequest): Promise<ApiResponse> {
    this.config.validate();

    // Normalize source and target languages with defaults
    const srcLangCode = normalizeLanguage(params.src_lang || 'eng_Latn');
    const tgtLangCode = normalizeLanguage(params.tgt_lang || 'kan_Knda');
    const query = params.query || 'describe the image';

    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path), {
        filename: params.file_path,
        contentType: 'image/png',
      });
      form.append('query', query);
      form.append('src_lang', srcLangCode);
      form.append('tgt_lang', tgtLangCode);

      // Use relative path and let axios handle baseURL
      const response = await this.config.client.post(
        `/v1/indic_visual_query?src_lang=${srcLangCode}&tgt_lang=${tgtLangCode}`,
        form,
        {
          headers: {
            ...this.config.headers(),
            ...form.getHeaders(),
            accept: 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new DwaniAPIError(error.response);
      }
      throw new Error(`Vision API error: ${error.message}`);
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
    // Normalize language
    const languageCode = normalizeLanguage(params.language);
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path));
      form.append('language', languageCode);

      const response = await this.config.client.post(
        `/v1/transcribe?language=${languageCode}`,
        form,
        {
          headers: {
            ...this.config.headers(),
            ...form.getHeaders(),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new DwaniAPIError(error.response || error);
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
      const response = await this.config.client.post('/v1/audio/speech', params, {
        headers: this.config.headers(),
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error: any) {
      throw new DwaniAPIError(error.response || error);
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
    // Normalize languages
    const normalizedParams = {
      ...params,
      src_lang: normalizeLanguage(params.src_lang),
      tgt_lang: normalizeLanguage(params.tgt_lang),
    };
    try {
      const response = await this.config.client.post('/v1/translate', normalizedParams);
      return response.data;
    } catch (error: any) {
      throw new DwaniAPIError(error.response || error);
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
    // Normalize languages
    const srcLangCode = normalizeLanguage(params.src_lang);
    const tgtLangCode = normalizeLanguage(params.tgt_lang);
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path));
      form.append('page_number', params.page_number.toString());
      form.append('src_lang', srcLangCode);
      form.append('tgt_lang', tgtLangCode);

      const response = await this.config.client.post('/v1/indic-extract-text', form, {
        headers: {
          ...this.config.headers(),
          ...form.getHeaders(),
        },
      });
      return response.data;
    } catch (error: any) {
      throw new DwaniAPIError(error.response || error);
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