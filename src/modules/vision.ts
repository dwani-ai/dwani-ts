import FormData from 'form-data';
import * as fs from 'fs';
import { VisionRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';
import { normalizeLanguage } from '../utils/language';

export class Vision {
  constructor(private config: DwaniConfig) {}

  public async caption(params: VisionRequest): Promise<ApiResponse> {
    this.config.validate();
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