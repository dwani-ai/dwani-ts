import { ChatRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';
import { normalizeLanguage } from '../utils/language';

export class Chat {
  constructor(private config: DwaniConfig) {}

  public async create(params: ChatRequest): Promise<ApiResponse> {
    this.config.validate();
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