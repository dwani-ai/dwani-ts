## dwani.ai 

#### dwani.ai TypeScript SDK is a Node.js library for interacting with the dwani.ai API
- Features
  - Chat: Send prompts and receive responses, supporting multilingual conversations.
  - Vision: Generate captions for images with language-specific queries.
  - ASR: Transcribe audio files to text in various languages.
  - TTS: Convert text to speech in formats like MP3 or WAV.
  - Translation: Translate sentences between source and target languages.
   -Documents: Extract text from PDF documents with language support.

- Install Library
```bash
npm install dwani typescript @types/node
```

Set Up Environment Variables: Create a .env file in your project root:

    DWANI_API_KEY=your_api_key_here
    DWANI_API_BASE_URL=https://example-dwani-url.com



- Compile the example code
```bash
npx tsc example.ts
```

- Run the example
```
node example.js
```

```bash
src/
├── config/
│   └── dwaniConfig.ts       # DwaniConfig class and DwaniAPIError
├── interfaces/
│   └── requests.ts          # Interfaces (ChatRequest, VisionRequest, etc.)
├── modules/
│   ├── chat.ts              # Chat class
│   ├── vision.ts            # Vision class
│   ├── asr.ts               # ASR class
│   ├── audio.ts             # Audio class
│   ├── translate.ts         # Translate class
│   ├── documents.ts         # Documents class
├── utils/
│   └── language.ts          # Language validation/normalization functions
├── dwani.ts                 # Main Dwani class (entry point)
└── index.ts                 # Re-export all public classes/interfaces
```
- Notes
  - File Uploads: The Vision, ASR, and Documents modules require file paths for uploads (e.g., images, audio, PDFs). Ensure files exist in your project directory.
  - TTS Output: The Audio.speech method returns a Buffer containing binary audio data. Use fs.writeFile to save it (e.g., as output.mp3).
  - Error Handling: The library throws descriptive errors if API requests fail or if DWANI_API_KEY/DWANI_API_BASE_URL are missing.
  - Dependencies: Requires typescript, axios, form-data, dotenv, and @types/node.

- Contributing
  - Contributions are welcome! Please submit pull requests or issues to the repository.
- License
  - MIT License. See LICENSE for details.



<!-- 
- Build sdk
  - rm -rf dist/
  - npx tsc
  - rm -rf dist/
  - npm run build
  - npm link
  - npm login
  - npm publish


-->
