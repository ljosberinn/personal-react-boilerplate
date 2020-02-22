import { SITE_URL } from '../constants/env';

export const isValidReferrer = referer =>
  referer.includes('localhost:3000') || referer === SITE_URL;
