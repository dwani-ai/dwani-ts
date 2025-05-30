import { TTSRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';

export class Audio {
  constructor(private config: DwaniConfig) {}

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