// documents.ts
import FormData from 'form-data';
import * as fs from 'fs';
import { DocumentsRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';
import { normalizeLanguage } from '../utils/language';

export class Documents {
  constructor(private config: DwaniConfig) {}

  public async run_extract(params: DocumentsRequest): Promise<ApiResponse> {
    try {
      // Validate config
      this.config.validate();

      // Normalize language codes
      const srcLangCode = normalizeLanguage(params.src_lang);
      const tgtLangCode = normalizeLanguage(params.tgt_lang);

      // Check if file exists and is readable
      if (!fs.existsSync(params.file_path)) {
        throw new Error(`File not found: ${params.file_path}`);
      }

      // Create FormData
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path), {
        filename: params.file_path.split('/').pop(), // Ensure proper filename
        contentType: 'application/pdf',
      });
      form.append('page_number', params.page_number.toString());
      form.append('src_lang', srcLangCode);
      form.append('tgt_lang', tgtLangCode);

      // Make API request
      const response = await this.config.client.post(
        '/v1/indic-extract-text/', // Ensure endpoint matches exactly
        form,
        {
          headers: {
            ...this.config.headers(),
            ...form.getHeaders(), // Merge FormData headers correctly
          },
          timeout: 30000, // Add timeout (30 seconds) to avoid hanging
        }
      );

      // Check response status
      if (response.status !== 200) {
        throw new DwaniAPIError({
          status: response.status,
          message: response.data?.message || 'Unexpected response status',
        });
      }

      return response.data;
    } catch (error: any) {
      // Enhanced error handling
      if (error.response) {
        // API responded with an error
        throw new DwaniAPIError({
          status: error.response.status,
          message: error.response.data?.message || 'Unknown API error',
          data: error.response.data,
        });
      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        throw new DwaniAPIError({
          message: 'Request timed out',
          code: error.code,
        });
      } else if (error.code === 'ENOENT') {
        // File-related error
        throw new Error(`File error: ${error.message}`);
      } else {
        // Other errors (network, etc.)
        throw new DwaniAPIError({
          message: error.message || 'Unknown error occurred',
          code: error.code,
        });
      }
    }
  }
}