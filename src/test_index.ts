import dwani from './index';
import * as fs from 'fs/promises';

async function main() {
  try {
    // Chat example
    const chatResponse = await dwani.Chat.create({
      prompt: 'Hello!',
      src_lang: 'eng_Latn',
      tgt_lang: 'kan_Knda',
    });
    console.log('Chat:', chatResponse);

    
    // Vision example
    const visionResponse = await dwani.Vision.caption({
      file_path: './samples/image.png',
      query: 'Describe this image',
      src_lang: 'eng_Latn',
      tgt_lang: 'kan_Knda',
    });
    console.log('Vision:', visionResponse);
    
    // ASR example
    const asrResponse = await dwani.ASR.transcribe({
      file_path: './samples/kannada_sample.wav',
      language: 'kannada',
    });
    console.log('ASR:', asrResponse);
/*
    // TTS example
    const ttsResponse = await dwani.Audio.speech({
      input: 'Bonjour le monde',
      response_format: 'mp3',
    });
    await fs.writeFile('output.mp3', ttsResponse);
    console.log('TTS: Audio saved to output.mp3');

    // Translation example
    const translateResponse = await dwani.Translate.run_translate({
      sentences: ['Hello'],
      src_lang: 'eng_Latn',
      tgt_lang: 'spa_Latn',
    });
    console.log('Translate:', translateResponse);
*/
    // Documents example
    /*
    const docResponse = await dwani.Documents.run_extract({
      file_path: './samples/document.pdf',
      page_number: 1,
      src_lang: 'eng_Latn',
      tgt_lang: 'kan_Knda',
    });
    console.log('Documents:', docResponse);

    */
  } catch (error: any) {
    console.error('Error:', error.message);
  }
    
}

main();