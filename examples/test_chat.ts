import Dwani, { ChatCreateParams, TranscriptionParams, TranslationParams, VisualQueryParams, SpeechToSpeechParams, GenerateAudioParams, ExtractTextParams, ExtractAndTranslateParams, SummarizePDFParams, IndicSummarizePDFParams, CustomPromptPDFParams, IndicCustomPromptPDFParams, IndicCustomPromptKannadaPDFParams, ChatCompletionParams } from './dwani-sdk';
import fs from 'fs/promises';

async function main() {
  // Initialize SDK
  const dwani = new Dwani({
    apiBase: 'http://127.0.0.1:7890/v1',
    apiKey: 'sample-example',
  });

  try {
    // Health check
    const health = await dwani.healthCheck();
    console.log('Health Check:', health);

    // Generate audio
    const audioParams: GenerateAudioParams = {
      input: 'Hello, how are you?',
      responseFormat: 'mp3',
    };
    const audioBuffer = await dwani.generateAudio(audioParams);
    await fs.writeFile('output.mp3', audioBuffer);
    console.log('Audio saved to output.mp3');

    // Chat
    const chatParams: ChatCreateParams = {
      prompt: 'Hello, how are you?',
      srcLang: 'kan_Knda',
      tgtLang: 'kan_Knda',
    };
    const chatResponse = await dwani.chatCreate(chatParams);
    console.log('Chat Response:', chatResponse);

    // Transcribe audio
    const transcriptionParams: TranscriptionParams = {
      filePath: './sample_audio.wav',
      language: 'kannada',
    };
    const transcription = await dwani.transcribeAudio(transcriptionParams);
    console.log('Transcription:', transcription);

    // Translate text
    const translationParams: TranslationParams = {
      sentences: ['Hello', 'How are you?'],
      srcLang: 'en',
      tgtLang: 'kan_Knda',
    };
    const translation = await dwani.translate(translationParams);
    console.log('Translation:', translation);

    // Visual query
    const visualQueryParams: VisualQueryParams = {
      query: 'Describe the image',
      filePath: './sample_image.png',
      srcLang: 'kan_Knda',
      tgtLang: 'kan_Knda',
    };
    const visualQuery = await dwani.visualQuery(visualQueryParams);
    console.log('Visual Query:', visualQuery);

    // Speech-to-speech
    const speechToSpeechParams: SpeechToSpeechParams = {
      filePath: './sample_audio.wav',
      language: 'kannada',
    };
    const speechBuffer = await dwani.speechToSpeech(speechToSpeechParams);
    await fs.writeFile('speech_output.mp3', speechBuffer);
    console.log('Speech-to-speech output saved to speech_output.mp3');

    // Extract text from PDF
    const extractTextParams: ExtractTextParams = {
      filePath: './sample.pdf',
      pageNumber: 1,
    };
    const pdfText = await dwani.extractText(extractTextParams);
    console.log('PDF Text:', pdfText);

    // Extract and translate PDF
    const extractAndTranslateParams: ExtractAndTranslateParams = {
      filePath: './sample.pdf',
      pageNumber: 1,
      srcLang: 'eng_Latn',
      tgtLang: 'kan_Knda',
    };
    const translatedPDF = await dwani.extractAndTranslate(extractAndTranslateParams);
    console.log('Extracted and Translated PDF:', translatedPDF);

    // Summarize PDF
    const summarizePDFParams: SummarizePDFParams = {
      filePath: './sample.pdf',
      pageNumber: 1,
    };
    const pdfSummary = await dwani.summarizePDF(summarizePDFParams);
    console.log('PDF Summary:', pdfSummary);

    // Summarize and translate PDF
    const indicSummarizePDFParams: IndicSummarizePDFParams = {
      filePath: './sample.pdf',
      pageNumber: 1,
      srcLang: 'eng_Latn',
      tgtLang: 'kan_Knda',
    };
    const indicSummary = await dwani.indicSummarizePDF(indicSummarizePDFParams);
    console.log('Indic PDF Summary:', indicSummary);

    // Custom prompt PDF
    const customPromptPDFParams: CustomPromptPDFParams = {
      filePath: './sample.pdf',
      pageNumber: 1,
      prompt: 'List key points',
    };
    const customPrompt = await dwani.customPromptPDF(customPromptPDFParams);
    console.log('Custom Prompt PDF:', customPrompt);

    // Indic custom prompt PDF
    const indicCustomPromptPDFParams: IndicCustomPromptPDFParams = {
      filePath: './sample.pdf',
      pageNumber: 1,
      prompt: 'List key points',
      sourceLanguage: 'eng_Latn',
      targetLanguage: 'kan_Knda',
    };
    const indicCustomPrompt = await dwani.indicCustomPromptPDF(indicCustomPromptPDFParams);
    console.log('Indic Custom Prompt PDF:', indicCustomPrompt);

    // Generate Kannada PDF
    const indicCustomPromptKannadaPDFParams: IndicCustomPromptKannadaPDFParams = {
      filePath: './sample.pdf',
      pageNumber: 1,
      prompt: 'List key points',
      srcLang: 'eng_Latn',
    };
    const kannadaPDFBuffer = await dwani.indicCustomPromptKannadaPDF(indicCustomPromptKannadaPDFParams);
    await fs.writeFile('generated_kannada.pdf', kannadaPDFBuffer);
    console.log('Kannada PDF saved to generated_kannada.pdf');

    // Chat completions (OpenAI-compatible)
    const chatCompletionParams: ChatCompletionParams = {
      model: 'gemma-3-12b-it',
      messages: [{ role: 'user', content: 'Hello, how are you?' }],
      maxTokens: 100,
      temperature: 0.7,
    };
    const chatCompletion = await dwani.chatCompletions(chatCompletionParams);
    console.log('Chat Completion:', chatCompletion);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();