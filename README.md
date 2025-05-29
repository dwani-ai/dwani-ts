Dwani TypeScript SDK

```bash
npm install dwani-sdk typescript @types/node
```



<!-- 
- Build sdk
  - rm -rf dist/
  - npx tsc
  - rm -rf dist/
  - npm run build
  - npm link


-->
<!-- 

The Dwani TypeScript SDK is a Node.js library for interacting with the Dwani API, providing access to multimodal features such as Chat, Vision, Automatic Speech Recognition (ASR), Text-to-Speech (TTS), Translation, and Document extraction. This library mirrors the functionality of the Dwani Python SDK (european_language_support branch) and supports European languages (e.g., French: fra_Latn, German: deu_Latn, Spanish: spa_Latn, Italian: ita_Latn) in addition to other languages.
Features

    Chat: Send prompts and receive responses, supporting multilingual conversations.
    Vision: Generate captions for images with language-specific queries.
    ASR: Transcribe audio files to text in various languages.
    TTS: Convert text to speech in formats like MP3 or WAV.
    Translation: Translate sentences between source and target languages.
    Documents: Extract text from PDF documents with language support.

Installation

    Initialize a Node.js Project:
    bash

npm init -y
Install Dependencies:
bash
npm install typescript axios form-data dotenv @types/node --save-dev
Set Up TypeScript: Initialize TypeScript and create a tsconfig.json:
bash
npx tsc --init
Update tsconfig.json with:
json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
Set Up Environment Variables: Create a .env file in your project root:
text

    DWANI_API_KEY=your_api_key_here
    DWANI_API_BASE_URL=https://dwani-dwani-api.hf.space

Usage

The SDK is structured as a single index.ts file, exporting a Dwani client with modules for each API feature. Below is an example of how to use the library.
Example

Create a file (e.g., example.ts):
typescript
import dwani from './index';
import * as fs from 'fs/promises';

async function main() {
  try {
    // Chat example
    const chatResponse = await dwani.Chat.create({
      prompt: 'Hello!',
      src_lang: 'eng_Latn',
      tgt_lang: 'fra_Latn',
    });
    console.log('Chat:', chatResponse);

    // Vision example
    const visionResponse = await dwani.Vision.caption({
      file_path: './image.png',
      query: 'Describe this image',
      src_lang: 'eng_Latn',
      tgt_lang: 'deu_Latn',
    });
    console.log('Vision:', visionResponse);

    // ASR example
    const asrResponse = await dwani.ASR.transcribe({
      file_path: './audio.wav',
      language: 'french',
    });
    console.log('ASR:', asrResponse);

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

    // Documents example
    const docResponse = await dwani.Documents.run_extract({
      file_path: './document.pdf',
      page_number: 1,
      src_lang: 'eng_Latn',
      tgt_lang: 'ita_Latn',
    });
    console.log('Documents:', docResponse);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();
Compile and Run

    Compile the TypeScript code:
    bash

npx tsc
Run the compiled JavaScript:
bash

    node dist/example.js

Configuration

    API Key: Set DWANI_API_KEY in your .env file. The library uses the X-API-KEY header for authentication.
    Base URL: Set DWANI_API_BASE_URL in your .env file. Defaults to https://dwani-dwani-api.hf.space if not specified.
    Language Support: Use language codes like eng_Latn, fra_Latn, deu_Latn, spa_Latn, ita_Latn for src_lang and tgt_lang parameters.

API Endpoints

    Chat: /v1/indic_chat – Sends a chat prompt and returns a response.
    Vision: /vision/caption – Generates captions for images.
    ASR: /asr/transcribe – Transcribes audio to text.
    TTS: /audio/speech – Converts text to audio (returns binary data).
    Translation: /translate – Translates sentences between languages.
    Documents: /documents/extract – Extracts text from documents.

Notes

    File Uploads: The Vision, ASR, and Documents modules require file paths for uploads (e.g., images, audio, PDFs). Ensure files exist in your project directory.
    TTS Output: The Audio.speech method returns a Buffer containing binary audio data. Use fs.writeFile to save it (e.g., as output.mp3).
    Error Handling: The library throws descriptive errors if API requests fail or if DWANI_API_KEY/DWANI_API_BASE_URL are missing.
    European Language Support: The library supports European languages as per the european_language_support branch, using ISO language codes with script tags (e.g., fra_Latn for French).
    Dependencies: Requires typescript, axios, form-data, dotenv, and @types/node.

Contributing

Contributions are welcome! Please submit pull requests or issues to the repository.
License

MIT License. See LICENSE for details.
Contact

For support, contact the Dwani team via their official website or API documentation.
-->
