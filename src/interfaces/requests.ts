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

export interface ApiResponse {
  [key: string]: any;
}