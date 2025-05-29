import { TranslateRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';
import { normalizeLanguage } from '../utils/language';

export class Translate {
  constructor(private config: DwaniConfig) {}

  public async run_translate(params: TranslateRequest): Promise<ApiResponse> {
    this.config.validate();
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