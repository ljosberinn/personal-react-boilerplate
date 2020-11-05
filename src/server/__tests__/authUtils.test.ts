import { createIncomingMessageMock } from '../../../testUtils/api';
import { getOrigin } from '../auth/utils';

describe('getOrigin', () => {
  const forwardedHost = 'next-karma';

  describe('host', () => {
    test('prefers "x-forwarded-host" if present', () => {
      const notPreferred = 'nope-karma';

      const mockIncomingMessage = createIncomingMessageMock({
        headers: {
          host: notPreferred,
          'x-forwarded-host': forwardedHost,
        },
      });

      expect(getOrigin(mockIncomingMessage)).toBe(`https://${forwardedHost}`);
    });

    test('prefers "host" if "x-forwarded-host" is absent', () => {
      const host = forwardedHost;

      const mockIncomingMessage = createIncomingMessageMock({
        headers: {
          host,
        },
      });

      expect(getOrigin(mockIncomingMessage)).toBe(`https://${host}`);
    });

    test('falls back to "localhost:3000" if no "host" is present', () => {
      expect(getOrigin(createIncomingMessageMock())).toBe(
        'http://localhost:3000'
      );
    });
  });

  describe('protocol', () => {
    test('http if "x-forwarded-proto"', () => {
      const mockIncomingMessage = createIncomingMessageMock({
        headers: {
          'x-forwarded-proto': 'foo',
        },
      });

      expect(getOrigin(mockIncomingMessage)).toBe('http://localhost:3000');
    });

    test('http if "x-forwarded-proto" and "x-forwarded-host"', () => {
      const mockIncomingMessage = createIncomingMessageMock({
        headers: {
          'x-forwarded-host': forwardedHost,
          'x-forwarded-proto': 'foo',
        },
      });

      expect(getOrigin(mockIncomingMessage)).toBe(`http://${forwardedHost}`);
    });

    test('https if no "x-forwarded-proto" and "host" is not localhost-y', () => {
      const mockIncomingMessage = createIncomingMessageMock({
        headers: {
          'x-forwarded-host': forwardedHost,
        },
      });

      expect(getOrigin(mockIncomingMessage)).toBe(`https://${forwardedHost}`);
    });
  });
});
