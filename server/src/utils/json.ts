import { readFileSync } from 'fs';

export const readJSONFromFile = (path: string) =>
  JSON.parse(readFileSync(path, { encoding: 'utf8' }));
