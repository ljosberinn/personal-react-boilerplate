/* eslint-disable jest/require-top-level-describe */
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Router from 'next/router';

import { render, screen, waitFor } from '../../../testUtils';
import { UNAUTHORIZED } from '../../utils/statusCodes';
import { AuthContextProvider, endpoints } from '../context/AuthContext';
import type { User } from '../context/AuthContext/types';
import { useAuth } from '../hooks/useAuth';

const authenticated = 'authenticated';
const notAuthenticated = 'not-authenticated';

const reauthenticating = 'reauthenticating';
const notReauthenticating = 'not-reauthenticating';

const mockUser: User = { id: '1', name: 'ljosberinn' };
const realLocation = window.location;

const server = setupServer();

beforeAll(() => {
  server.listen();

  // @ts-expect-error jest does not support location to be spied on
  delete window.location;
  window.location = { ...realLocation, assign: jest.fn() };
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  window.location = realLocation;
});

function MockComponent() {
  const { isAuthenticated, user, isReauthenticating } = useAuth();

  return (
    <>
      <h1>{isAuthenticated ? authenticated : notAuthenticated}</h1>
      <h1>{isReauthenticating ? reauthenticating : notReauthenticating}</h1>
      <code data-testid="user">{JSON.stringify(user)}</code>
    </>
  );
}

const mockEndpoint = `http://localhost${endpoints.me.url}`;

describe('<AuthContextProvider />', () => {
  describe('ssg effect given shouldAttemptReauthentication', () => {
    test('sets state after success', async () => {
      server.use(
        rest.get(mockEndpoint, (_req, res, ctx) => res(ctx.json(mockUser)))
      );

      render(
        <AuthContextProvider
          mode="ssg"
          session={null}
          shouldAttemptReauthentication
        >
          <MockComponent />
        </AuthContextProvider>,
        {
          omitKarmaProvider: true,
        }
      );

      expect(screen.getByText(notAuthenticated)).toBeInTheDocument();
      expect(screen.getByTestId('user')).toHaveTextContent('null');

      await waitFor(() => {
        expect(screen.getByText(authenticated)).toBeInTheDocument();
      });

      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      );
    });

    test('does not set state after failure', async () => {
      server.use(
        rest.get(mockEndpoint, (_req, res, ctx) =>
          res(ctx.status(UNAUTHORIZED))
        )
      );

      render(
        <AuthContextProvider
          mode="ssg"
          session={null}
          shouldAttemptReauthentication
        >
          <MockComponent />
        </AuthContextProvider>,
        {
          omitKarmaProvider: true,
        }
      );

      expect(screen.getByText(notAuthenticated)).toBeInTheDocument();
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    test('provides reauthentication progress through boolean', async () => {
      server.use(
        rest.get(mockEndpoint, (_req, res, ctx) =>
          res(ctx.status(UNAUTHORIZED))
        )
      );

      render(
        <AuthContextProvider
          mode="ssg"
          session={null}
          shouldAttemptReauthentication
        >
          <MockComponent />
        </AuthContextProvider>,
        {
          omitKarmaProvider: true,
        }
      );

      expect(screen.getByText(reauthenticating)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(notReauthenticating)).toBeInTheDocument();
      });
    });

    test('fails gracefully if request fails', async () => {
      jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
        throw new Error('test');
      });

      render(
        <AuthContextProvider
          mode="ssg"
          session={null}
          shouldAttemptReauthentication
        >
          <MockComponent />
        </AuthContextProvider>,
        {
          omitKarmaProvider: true,
        }
      );

      expect(screen.getByText(notAuthenticated)).toBeInTheDocument();
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    describe('given redirectDestinationIfUnauthenticated', () => {
      test('redirects on failure via "Router.push"', async () => {
        const mockPush = jest.spyOn(Router, 'push').mockResolvedValueOnce(true);

        const url = '/foo';

        server.use(
          rest.get(mockEndpoint, (_req, res, ctx) =>
            res(ctx.status(UNAUTHORIZED))
          )
        );

        render(
          <AuthContextProvider
            mode="ssg"
            session={null}
            shouldAttemptReauthentication
            redirectDestinationIfUnauthenticated={url}
          >
            <MockComponent />
          </AuthContextProvider>,
          {
            omitKarmaProvider: true,
          }
        );

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledTimes(1);
        });

        expect(mockPush).toHaveBeenCalledWith(url);
      });

      test('redirects via location if "Router.push" fails', async () => {
        const mockPush = jest
          .spyOn(Router, 'push')
          .mockImplementationOnce(() => {
            throw new Error('error');
          });

        const url = '/foo';

        server.use(
          rest.get(mockEndpoint, (_req, res, ctx) =>
            res(ctx.status(UNAUTHORIZED))
          )
        );

        render(
          <AuthContextProvider
            mode="ssg"
            session={null}
            shouldAttemptReauthentication
            redirectDestinationIfUnauthenticated={url}
          >
            <MockComponent />
          </AuthContextProvider>,
          {
            omitKarmaProvider: true,
          }
        );

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledTimes(1);
        });

        expect(window.location.assign).toHaveBeenCalledTimes(1);
        expect(window.location.assign).toHaveBeenCalledWith(url);
      });
    });
  });
});
