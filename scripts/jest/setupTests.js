import { parse, serialize } from 'cookie';
import { config } from 'dotenv';
import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';

config();

// eslint-disable-next-line jest/require-top-level-describe
afterEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();

  Object.keys(parse(document.cookie)).forEach((key) => {
    document.cookie = serialize(key, '', {
      maxAge: -1,
    });
  });
});
