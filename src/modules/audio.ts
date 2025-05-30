// audio.ts
import { TTSRequest, ApiResponse } from '../interfaces/requests';
import { DwaniConfig, DwaniAPIError } from '../config/dwaniConfig';

export class Audio {
  constructor(private config: DwaniConfig) {}

  public async speech(params: TTSRequest): Promise<Buffer> {
    try {
      // Validate config
      this.config.validate();

      // Prepare query parameters
      const queryParams = new URLSearchParams({
        input: params.input || '', // Ensure input is provided
        response_format: params.response_format || 'mp3', // Default to mp3 if not specified
      });

      // Make API request
      const response = await this.config.client.post(
        `/v1/audio/speech?${queryParams.toString()}`, // Append query parameters to URL
        null, // No body, as per cURL
        {
          headers: {
            ...this.config.headers(),
            accept: 'audio/mpeg', // Adjust for MP3 response
          },
          responseType: 'arraybuffer', // Handle binary response
          timeout: 30000, // Add timeout (30 seconds) to avoid hanging
        }
      );

      // Check response status
      if (response.status !== 200) {
        throw new DwaniAPIError({
          status: response.status,
          message: response.data?.message || 'Unexpected response status',
          data: response.data,
        });
      }

      return Buffer.from(response.data);
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