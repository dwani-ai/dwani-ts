import dwani from 'dwani-ts';
import * as fs from 'fs/promises';
import { ChatRequest, VisionRequest, ASRRequest, TTSRequest, TranslateRequest, DocumentsRequest } from 'dwani-sdk';

async function main() {
  try {
    // Chat example: Multilingual conversation
    const chatParams: ChatRequest = {
      prompt: 'What is the capital of France?',
      src_lang: 'eng_Latn',
      tgt_lang: 'fra_Latn',
    };
    const chatResponse = await dwani.Chat.create(chatParams);
    console.log('Chat Response:', JSON.stringify(chatResponse, null, 2));

    // Vision example: Image captioning
    const visionParams: VisionRequest = {
      file_path: './sample_image.jpg',
      query: 'Describe the contents of this image in detail.',
      src_lang: 'eng_Latn',
      tgt_lang: 'deu_Latn',
    };
    const visionResponse = await dwani.Vision.caption(visionParams);
    console.log('Vision Response:', JSON.stringify(visionResponse, null, 2));

    // ASR example: Audio transcription
    const asrParams: ASRRequest = {
      file_path: './sample_audio.wav',
      language: 'french',
    };
    const asrResponse = await dwani.ASR.transcribe(asrParams);
    console.log('ASR Response:', JSON.stringify(asrResponse, null, 2));

    // TTS example: Text-to-speech conversion
    const ttsParams: TTSRequest = {
      input: 'Bonjour, comment allez-vous?',
      response_format: 'mp3',
    };
    const ttsResponse = await dwani.Audio.speech(ttsParams);
    await fs.writeFile('output_audio.mp3', ttsResponse);
    console.log('TTS: Audio saved to output_audio.mp3');

    // Translation example: Sentence translation
    const translateParams: TranslateRequest = {
      sentences: ['The weather is nice today.', 'I am learning TypeScript.'],
      src_lang: 'eng_Latn',
      tgt_lang: 'spa_Latn',
    };
    const translateResponse = await dwani.Translate.run_translate(translateParams);
    console.log('Translation Response:', JSON.stringify(translateResponse, null, 2));

    // Documents example: PDF text extraction
    const docParams: DocumentsRequest = {
      file_path: './sample_document.pdf',
      page_number: 1,
      src_lang: 'eng_Latn',
      tgt_lang: 'ita_Latn',
    };
    const docResponse = await dwani.Documents.run_extract(docParams);
    console.log('Documents Response:', JSON.stringify(docResponse, null, 2));
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();