"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dwani_sdk_1 = __importDefault(require("dwani-sdk"));
const fs = __importStar(require("fs/promises"));
async function main() {
    try {
        // Chat example: Multilingual conversation
        const chatParams = {
            prompt: 'What is the capital of France?',
            src_lang: 'eng_Latn',
            tgt_lang: 'fra_Latn',
        };
        const chatResponse = await dwani_sdk_1.default.Chat.create(chatParams);
        console.log('Chat Response:', JSON.stringify(chatResponse, null, 2));
        // Vision example: Image captioning
        const visionParams = {
            file_path: './sample_image.jpg',
            query: 'Describe the contents of this image in detail.',
            src_lang: 'eng_Latn',
            tgt_lang: 'deu_Latn',
        };
        const visionResponse = await dwani_sdk_1.default.Vision.caption(visionParams);
        console.log('Vision Response:', JSON.stringify(visionResponse, null, 2));
        // ASR example: Audio transcription
        const asrParams = {
            file_path: './sample_audio.wav',
            language: 'french',
        };
        const asrResponse = await dwani_sdk_1.default.ASR.transcribe(asrParams);
        console.log('ASR Response:', JSON.stringify(asrResponse, null, 2));
        // TTS example: Text-to-speech conversion
        const ttsParams = {
            input: 'Bonjour, comment allez-vous?',
            response_format: 'mp3',
        };
        const ttsResponse = await dwani_sdk_1.default.Audio.speech(ttsParams);
        await fs.writeFile('output_audio.mp3', ttsResponse);
        console.log('TTS: Audio saved to output_audio.mp3');
        // Translation example: Sentence translation
        const translateParams = {
            sentences: ['The weather is nice today.', 'I am learning TypeScript.'],
            src_lang: 'eng_Latn',
            tgt_lang: 'spa_Latn',
        };
        const translateResponse = await dwani_sdk_1.default.Translate.run_translate(translateParams);
        console.log('Translation Response:', JSON.stringify(translateResponse, null, 2));
        // Documents example: PDF text extraction
        const docParams = {
            file_path: './sample_document.pdf',
            page_number: 1,
            src_lang: 'eng_Latn',
            tgt_lang: 'ita_Latn',
        };
        const docResponse = await dwani_sdk_1.default.Documents.run_extract(docParams);
        console.log('Documents Response:', JSON.stringify(docResponse, null, 2));
    }
    catch (error) {
        console.error('Error:', error.message);
    }
}
main();
