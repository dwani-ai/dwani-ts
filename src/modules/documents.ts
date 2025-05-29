import FormData from 'form-data';
import * as fs from 'fs';
import { DocumentsRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';
import { normalizeLanguage } from '../utils/language';

export class Documents {
  constructor(private config: DwaniConfig) {}

  public async run_extract(params: DocumentsRequest): Promise<ApiResponse> {
    this.config.validate();
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