export const SUPPORTED_LANGS = ['en', 'fr', 'nl'];
const DEFAULT_LANG = 'en';

export const normalizeLang = (value = DEFAULT_LANG) => {
  if (!value) return DEFAULT_LANG;
  const normalized = value.toLowerCase();
  if (SUPPORTED_LANGS.includes(normalized)) return normalized;
  const short = normalized.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : DEFAULT_LANG;
};

export const ensureTranslations = (baseValue, provided = {}) => {
  const translations = {};
  SUPPORTED_LANGS.forEach((lang) => {
    if (provided?.[lang]) translations[lang] = provided[lang];
  });
  if (baseValue && !translations.en) {
    translations.en = baseValue;
  }
  return Object.keys(translations).length ? translations : null;
};

export const pickTranslation = (translations, lang, fallback) => {
  if (!translations || typeof translations !== 'object') return fallback;
  const normalized = normalizeLang(lang);
  return translations?.[normalized] ?? translations?.en ?? fallback;
};

export const applyLocalizedFields = (record, fields, lang) => {
  const plain = record?.get ? record.get({ plain: true }) : { ...(record || {}) };
  const normalized = normalizeLang(lang);
  fields.forEach((field) => {
    const source = plain?.[`${field}Translations`];
    if (source) {
      plain[field] = source[normalized] ?? source.en ?? plain[field];
    }
  });
  return plain;
};
