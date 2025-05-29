// Language options for Vision, Chat, Translate, Documents
export const languageOptions: { name: string; code: string }[] = [
  { name: 'English', code: 'eng_Latn' },
  { name: 'Kannada', code: 'kan_Knda' },
  { name: 'Hindi', code: 'hin_Deva' },
  { name: 'Assamese', code: 'asm_Beng' },
  { name: 'Bengali', code: 'ben_Beng' },
  { name: 'Gujarati', code: 'guj_Gujr' },
  { name: 'Malayalam', code: 'mal_Mlym' },
  { name: 'Marathi', code: 'mar_Deva' },
  { name: 'Odia', code: 'ory_Orya' },
  { name: 'Punjabi', code: 'pan_Guru' },
  { name: 'Tamil', code: 'tam_Taml' },
  { name: 'Telugu', code: 'tel_Telu' },
  { name: 'German', code: 'deu_Latn' },
];

const langNameToCode: Record<string, string> = {};
const langCodeToCode: Record<string, string> = {};

languageOptions.forEach(({ name, code }) => {
  langNameToCode[name.toLowerCase()] = code;
  langCodeToCode[code] = code;
});

export function normalizeLanguage(lang: string): string {
  const langNormalized = lang.trim();
  const langLower = langNormalized.toLowerCase();

  if (langNameToCode[langLower]) {
    return langNameToCode[langLower];
  }

  if (langCodeToCode[langNormalized]) {
    return langCodeToCode[langNormalized];
  }

  const supportedLangs = [
    ...Object.keys(langNameToCode),
    ...Object.keys(langCodeToCode),
  ];
  throw new Error(
    `Unsupported language: ${lang}. Supported languages: ${supportedLangs.join(', ')}`
  );
}

// Allowed languages for ASR
export const ALLOWED_LANGUAGES = [
  'Assamese',
  'Bengali',
  'Gujarati',
  'Hindi',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Odia',
  'Punjabi',
  'Tamil',
  'Telugu',
  'English',
  'German',
];

export function validateLanguage(language: string): string {
  const languageMap: Record<string, string> = {};
  ALLOWED_LANGUAGES.forEach((lang) => {
    languageMap[lang.toLowerCase()] = lang;
  });

  if (!languageMap[language.toLowerCase()]) {
    throw new Error(
      `Unsupported language: ${language}. Supported languages: ${ALLOWED_LANGUAGES.join(', ')}`
    );
  }

  return language.toLowerCase();
}