import { waitFor, render, screen } from '../../../testUtils';
import { i18nCache } from '../../../testUtils/i18n';
import { createUseRouterMock } from '../../../testUtils/router';
import { FALLBACK_LANGUAGE } from '../../constants';
import * as Core from '../karma/Core';
import { KarmaSSR } from '../karma/SSR';
import type { KarmaSSRProps } from '../karma/SSR';

describe('<KarmaSSR />', () => {
  const children = 'next-karma';

  const defaultI18n: KarmaSSRProps['i18n'] = {
    locale: FALLBACK_LANGUAGE,
    resources: i18nCache,
  };

  test('forwards "mode="ssg" prop onto KarmaCore', () => {
    const mockProps: KarmaSSRProps = {
      auth: { session: null },
      cookies: '',
      i18n: defaultI18n,
    };

    const coreSpy = jest.spyOn(Core, 'KarmaCore');

    render(<KarmaSSR {...mockProps}>{children}</KarmaSSR>, {
      omitKarmaProvider: true,
    });

    expect(coreSpy).toHaveBeenCalledTimes(1);
    expect(coreSpy).toHaveBeenCalledWith(
      {
        auth: mockProps.auth,
        children,
        colorModeManager: expect.anything(),
        i18n: mockProps.i18n,
        mode: 'ssr',
      },
      {}
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
        i18n: defaultI18n,
      };

      render(<KarmaSSR {...props}>{children}</KarmaSSR>, {
        omitKarmaProvider: true,
      });

      expect(screen.queryByText('next-karma')).not.toBeInTheDocument();

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledTimes(1);
      });

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
        i18n: defaultI18n,
      };

      render(<KarmaSSR {...props}>{children}</KarmaSSR>, {
        omitKarmaProvider: true,
      });

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledTimes(1);
      });

      expect(window.location.assign).toHaveBeenCalledTimes(1);
      expect(window.location.assign).toHaveBeenCalledWith(
        redirectDestinationIfUnauthenticated
      );
    });
  });
});
