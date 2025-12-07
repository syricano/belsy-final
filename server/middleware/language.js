import { normalizeLang } from '../utils/localization.js';

const languageMiddleware = (req, _res, next) => {
  const raw = req.query?.lang || req.headers['accept-language'] || '';
  const first = Array.isArray(raw) ? raw[0] : raw;
  req.lang = normalizeLang((first || '').split(',')[0]);
  next();
};

export default languageMiddleware;
