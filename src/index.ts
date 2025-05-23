import axios, { AxiosInstance, AxiosResponse } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { Readable } from 'stream';

// Interface for SDK configuration
export interface DwaniOptions {
  apiKey?: string;
  apiBase?: string;
}

// Interfaces for request and response models
export interface ChatCreateParams {
  prompt: string;
  srcLang: string;
  tgtLang: string;
}

export interface ChatCreateResponse {
  response: string;
}

export interface TranscriptionParams {
  filePath: string;
  language: string;
}

export interface TranscriptionResponse {
  text: string;
}

export interface TranslationParams {
  sentences: string[];
  srcLang: string;
  tgtLang: string;
}

export interface TranslationResponse {
  translations: string[];
}

export interface VisualQueryParams {
  query: string;
  filePath: string;
  srcLang: string;
  tgtLang: string;
}

export interface VisualQueryResponse {
  answer: string;
}

export interface SpeechToSpeechParams {
  filePath: string;
  language: string;
}

export interface GenerateAudioParams {
  input: string;
  responseFormat?: string;
}

export interface ExtractTextParams {
  filePath: string;
  pageNumber: number;
}

export interface ExtractTextResponse {
  page_content: string;
}

export interface ExtractAndTranslateParams {
  filePath: string;
  pageNumber?: number;
  srcLang?: string;
  tgtLang?: string;
}

export interface DocumentProcessPage {
  processed_page: number;
  page_content: string;
  translated_content?: string | null;
}

export interface DocumentProcessResponse {
  pages: DocumentProcessPage[];
}

export interface SummarizePDFParams {
  filePath: string;
  pageNumber: number;
}

export interface SummarizePDFResponse {
  original_text: string;
  summary: string;
  processed_page: number;
}

export interface IndicSummarizePDFParams {
  filePath: string;
  pageNumber: number;
  srcLang: string;
  tgtLang: string;
}

export interface IndicSummarizePDFResponse {
  original_text: string;
  summary: string;
  translated_summary: string;
  processed_page: number;
}

export interface CustomPromptPDFParams {
  filePath: string;
  pageNumber: number;
  prompt: string;
}

export interface CustomPromptPDFResponse {
  original_text: string;
  response: string;
  processed_page: number;
}

export interface IndicCustomPromptPDFParams {
  filePath: string;
  pageNumber: number;
  prompt: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface IndicCustomPromptPDFResponse {
  original_text: string;
  response: string;
  translated_response: string;
  processed_page: number;
}

export interface IndicCustomPromptKannadaPDFParams {
  filePath: string;
  pageNumber: number;
  prompt: string;
  srcLang: string;
}

export interface ChatCompletionMessage {
  role: string;
  content: string;
}

export interface ChatCompletionParams {
  model?: string;
  messages: ChatCompletionMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface ChatCompletionChoice {
  index: number;
  message: ChatCompletionMessage;
  finish_reason?: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;
}

export class Dwani {
  private apiKey: string;
  private apiBase: string;
  private http: AxiosInstance;

  constructor(options: DwaniOptions) {
    this.apiKey = options.apiKey || '';
    this.apiBase = options.apiBase || 'http://127.0.0.1:7890/v1';
    this.http = axios.create({
      baseURL: this.apiBase,
      headers: {
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 seconds timeout
    });
  }

  /**
   * Check API health
   * @returns Health status response
   */
  async healthCheck(): Promise<{ status: string; model: string }> {
    try {
      const response = await this.http.get('/health');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Health check failed');
    }
  }

  /**
   * Generate speech from text
   * @param params Parameters for audio generation
   * @returns Audio buffer
   */
  async generateAudio(params: GenerateAudioParams): Promise<Buffer> {
    const { input, responseFormat = 'mp3' } = params;
    try {
      const response = await this.http.post(
        `/audio/speech?input=${encodeURIComponent(input)}&response_format=${responseFormat}`,
        {},
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(response.data);
    } catch (error) {
      this.handleError(error, 'Generate audio failed');
    }
  }

  /**
   * Chat with AI
   * @param params Chat parameters
   * @returns Chat response
   */
  async chatCreate(params: ChatCreateParams): Promise<ChatCreateResponse> {
    const { prompt, srcLang, tgtLang } = params;
    try {
      const response = await this.http.post<ChatCreateResponse>('/indic_chat', {
        prompt,
        src_lang: srcLang,
        tgt_lang: tgtLang,
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Chat request failed');
    }
  }

  /**
   * Transcribe audio file
   * @param params Transcription parameters
   * @returns Transcription response
   */
  async transcribeAudio(params: TranscriptionParams): Promise<TranscriptionResponse> {
    const { filePath, language } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('language', language);

      const response = await this.http.post<TranscriptionResponse>('/transcribe/', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Audio transcription failed');
    }
  }

  /**
   * Translate text
   * @param params Translation parameters
   * @returns Translation response
   */
  async translate(params: TranslationParams): Promise<TranslationResponse> {
    const { sentences, srcLang, tgtLang } = params;
    try {
      const response = await this.http.post<TranslationResponse>('/translate', {
        sentences,
        src_lang: srcLang,
        tgt_lang: tgtLang,
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Translation request failed');
    }
  }

  /**
   * Process visual query with image
   * @param params Visual query parameters
   * @returns Visual query response
   */
  async visualQuery(params: VisualQueryParams): Promise<VisualQueryResponse> {
    const { query, filePath, srcLang, tgtLang } = params;
    try {
      const form = new FormData();
      form.append('query', query);
      form.append('file', fs.createReadStream(filePath));
      form.append('src_lang', srcLang);
      form.append('tgt_lang', tgtLang);

      const response = await this.http.post<VisualQueryResponse>('/indic_visual_query', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Visual query failed');
    }
  }

  /**
   * Speech-to-speech conversion
   * @param params Speech-to-speech parameters
   * @returns Audio buffer
   */
  async speechToSpeech(params: SpeechToSpeechParams): Promise<Buffer> {
    const { filePath, language } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('language', language);

      const response = await this.http.post('/speech_to_speech', form, {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.handleError(error, 'Speech-to-speech conversion failed');
    }
  }

  /**
   * Extract text from a PDF
   * @param params PDF extraction parameters
   * @returns Extracted text response
   */
  async extractText(params: ExtractTextParams): Promise<ExtractTextResponse> {
    const { filePath, pageNumber } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('page_number', pageNumber.toString());

      const response = await this.http.post<ExtractTextResponse>('/extract-text', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'PDF text extraction failed');
    }
  }

  /**
   * Extract and translate text from a PDF
   * @param params PDF extraction and translation parameters
   * @returns Extracted and translated text response
   */
  async extractAndTranslate(params: ExtractAndTranslateParams): Promise<DocumentProcessResponse> {
    const { filePath, pageNumber = 1, srcLang = 'eng_Latn', tgtLang = 'kan_Knda' } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('page_number', pageNumber.toString());
      form.append('src_lang', srcLang);
      form.append('tgt_lang', tgtLang);

      const response = await this.http.post<DocumentProcessResponse>('/indic-extract-text/', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'PDF extract and translate failed');
    }
  }

  /**
   * Summarize a specific page of a PDF
   * @param params PDF summarization parameters
   * @returns Summarization response
   */
  async summarizePDF(params: SummarizePDFParams): Promise<SummarizePDFResponse> {
    const { filePath, pageNumber } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('page_number', pageNumber.toString());

      const response = await this.http.post<SummarizePDFResponse>('/summarize-pdf', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'PDF summarization failed');
    }
  }

  /**
   * Summarize and translate a specific page of a PDF
   * @param params PDF summarization and translation parameters
   * @returns Summarization and translation response
   */
  async indicSummarizePDF(params: IndicSummarizePDFParams): Promise<IndicSummarizePDFResponse> {
    const { filePath, pageNumber, srcLang, tgtLang } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('page_number', pageNumber.toString());
      form.append('src_lang', srcLang);
      form.append('tgt_lang', tgtLang);

      const response = await this.http.post<IndicSummarizePDFResponse>('/indic-summarize-pdf', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Indic PDF summarization failed');
    }
  }

  /**
   * Process a PDF with a custom prompt
   * @param params Custom prompt parameters
   * @returns Custom prompt response
   */
  async customPromptPDF(params: CustomPromptPDFParams): Promise<CustomPromptPDFResponse> {
    const { filePath, pageNumber, prompt } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('page_number', pageNumber.toString());
      form.append('prompt', prompt);

      const response = await this.http.post<CustomPromptPDFResponse>('/custom-prompt-pdf', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Custom prompt PDF processing failed');
    }
  }

  /**
   * Process a PDF with a custom prompt and translate
   * @param params Custom prompt and translation parameters
   * @returns Custom prompt and translated response
   */
  async indicCustomPromptPDF(params: IndicCustomPromptPDFParams): Promise<IndicCustomPromptPDFResponse> {
    const { filePath, pageNumber, prompt, sourceLanguage, targetLanguage } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('page_number', pageNumber.toString());
      form.append('prompt', prompt);
      form.append('source_language', sourceLanguage);
      form.append('target_language', targetLanguage);

      const response = await this.http.post<IndicCustomPromptPDFResponse>('/indic-custom-prompt-pdf', form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Indic custom prompt PDF processing failed');
    }
  }

  /**
   * Generate a Kannada PDF with a custom prompt
   * @param params Kannada PDF generation parameters
   * @returns Generated PDF buffer
   */
  async indicCustomPromptKannadaPDF(params: IndicCustomPromptKannadaPDFParams): Promise<Buffer> {
    const { filePath, pageNumber, prompt, srcLang } = params;
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('page_number', pageNumber.toString());
      form.append('prompt', prompt);
      form.append('src_lang', srcLang);

      const response = await this.http.post('/indic-custom-prompt-kannada-pdf', form, {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.handleError(error, 'Kannada PDF generation failed');
    }
  }

  /**
   * OpenAI-compatible chat completions
   * @param params Chat completion parameters
   * @returns Chat completion response
   */
  async chatCompletions(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    const { model = 'gemma-3-12b-it', messages, maxTokens, temperature = 1.0, topP = 1.0, stream = false } = params;
    try {
      const response = await this.http.post<ChatCompletionResponse>('/chat/completions', {
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        stream,
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Chat completions failed');
    }
  }

  /**
   * Handle errors and throw formatted exceptions
   * @param error The error object
   * @param message Custom error message
   * @throws Error Formatted error
   */
  private handleError(error: any, message: string): never {
    const statusCode = error.response?.status || 500;
    let detail = error.response?.data?.detail || error.message;

    if (statusCode === 504) {
      detail = 'Request timed out';
    } else if (statusCode === 400) {
      detail = `Bad request: ${detail}`;
    } else if (statusCode === 500) {
      detail = `Internal server error: ${detail}`;
    } else if (statusCode === 401) {
      detail = `Unauthorized: ${detail}`;
    } else if (statusCode === 429) {
      detail = `Rate limit exceeded: ${detail}`;
    }

    throw new Error(`${message}: ${detail} (Status: ${statusCode})`);
  }
}

export default Dwani;