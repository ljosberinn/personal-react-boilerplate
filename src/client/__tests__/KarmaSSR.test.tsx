import { waitFor, render, screen } from '../../../testUtils';
import { i18nCache } from '../../../testUtils/i18n';
import { createUseRouterMock } from '../../../testUtils/router';
import * as i18n from '../i18n';
import type { KarmaSSRProps } from '../karma/SSR';
import { KarmaSSR } from '../karma/SSR';

describe('<KarmaSSR />', () => {
  const defaultProps: KarmaSSRProps = {
    auth: {
      session: null,
    },
    cookies: '',
    i18n: {
      bundle: i18nCache.de,
      language: 'en',
    },
  };

  test('Core initializes i18next', () => {
    const initI18NSpy = jest.spyOn(i18n, 'initI18Next');

    render(<KarmaSSR {...defaultProps}>next-karma</KarmaSSR>, {
      omitKarmaProvider: true,
    });

    expect(initI18NSpy).toHaveBeenCalledWith(
      expect.objectContaining(defaultProps.i18n)
    );
  });

  describe('client side redirect given no session and redirectDestinationIfUnauthenticated', () => {
    const realLocation = window.location;

    beforeAll(() => {
      // @ts-expect-error jest does not support location to be spied on
      delete window.location;
      window.location = { ...realLocation, assign: jest.fn() };
    });

    afterAll(() => {
      window.location = realLocation;
    });

    test('redirects via useRouter.replace', async () => {
      const mockReplace = jest.fn().mockResolvedValueOnce(true);
      createUseRouterMock({ replace: mockReplace });

      const redirectDestinationIfUnauthenticated = '/foo';

      const props: KarmaSSRProps = {
        auth: {
          redirectDestinationIfUnauthenticated,
          session: null,
        },
        cookies: '',
        i18n: defaultProps.i18n,
      };

      render(<KarmaSSR {...props}>next-karma</KarmaSSR>, {
        omitKarmaProvider: true,
      });

      expect(screen.queryByText('next-karma')).not.toBeInTheDocument();

      await waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1));

      expect(mockReplace).toHaveBeenCalledWith(
        redirectDestinationIfUnauthenticated
      );
    });

    test('redirects via window.location.assign if useRouter fails', async () => {
      const mockReplace = jest.fn().mockImplementationOnce(() => {
        throw new Error('error');
      });
      createUseRouterMock({ replace: mockReplace });

      const redirectDestinationIfUnauthenticated = '/foo';

      const props: KarmaSSRProps = {
        auth: {
          redirectDestinationIfUnauthenticated,
          session: null,
        },
        cookies: '',
        i18n: defaultProps.i18n,
      };

      render(<KarmaSSR {...props}>next-karma</KarmaSSR>, {
        omitKarmaProvider: true,
      });

      await waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1));

      expect(window.location.assign).toHaveBeenCalledTimes(1);
      expect(window.location.assign).toHaveBeenCalledWith(
        redirectDestinationIfUnauthenticated
      );
    });
  });
});
