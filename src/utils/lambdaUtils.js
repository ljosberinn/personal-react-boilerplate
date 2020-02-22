import { SITE_URL } from '../constants/env';

export const isValidReferer = referer =>
  referer.includes('localhost:3000') || referer.includes(SITE_URL);
