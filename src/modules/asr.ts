import FormData from 'form-data';
import * as fs from 'fs';
import { ASRRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';
import { validateLanguage, ALLOWED_LANGUAGES } from '../utils/language';

export class ASR {
  public async transcribe(params: ASRRequest): Promise<ApiResponse> {
    this.config.validate();
    const languageCode = validateLanguage(params.language);
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path));

      const response = await this.config.client.post(
        `/v1/transcribe/?language=${languageCode}`,
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
      if (error.response) {
        throw new DwaniAPIError(error.response);
      }
      throw new Error(`ASR API error: ${error.message}`);
    }
  }

  constructor(private config: DwaniConfig) {}
}