import * as fs from 'fs';
import FormData from 'form-data';
import { ASRRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';
import { validateLanguage } from '../utils/language';

export class ASR {
  constructor(private config: DwaniConfig) {}

  public async transcribe(params: ASRRequest): Promise<ApiResponse> {
    this.config.validate();
    const languageCode = validateLanguage(params.language);
    try {
      // Validate file accessibility
      await fs.promises.access(params.file_path, fs.constants.R_OK);
      const form = new FormData();
      form.append('file', fs.createReadStream(params.file_path));
      const response = await this.config.client.post(
        `/v1/transcribe/?language=${languageCode}`,
        form,
        { headers: form.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new DwaniAPIError({
        message: error.message,
        status: error.response?.status,
        code: error.code,
        data: error.response?.data,
      });
    }
  }
}