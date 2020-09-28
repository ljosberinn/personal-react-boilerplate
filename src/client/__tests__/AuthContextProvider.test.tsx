/* eslint-disable jest/require-top-level-describe */
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';

import { render, screen, waitFor } from '../../../testUtils';
import { createUseRouterMock } from '../../../testUtils/router';
import { UNAUTHORIZED } from '../../utils/statusCodes';
import { AuthContextProvider, endpoints } from '../context/AuthContext';
import type { User } from '../context/AuthContext/AuthContext';
import { useAuth } from '../hooks/useAuth';

const authenticated = 'authenticated';
const notAuthenticated = 'not-authenticated';
const mockUser: User = { id: '1', name: 'ljosberinn' };
const realLocation = window.location;

const server = setupServer();

beforeAll(() => {
  server.listen();

  // @ts-expect-error jest does not support location to be spied on
  delete window.location;
  window.location = { ...realLocation, assign: jest.fn() };
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
  window.location = realLocation;
});

function MockComponent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <h1>{isAuthenticated ? authenticated : notAuthenticated}</h1>
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

      await waitFor(() =>
        expect(screen.getByText(authenticated)).toBeInTheDocument()
      );

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

    describe('given redirectDestinationIfUnauthenticated', () => {
      test('redirects on failure via useRouter', async () => {
        const mockPush = jest.fn().mockResolvedValueOnce(true);
        createUseRouterMock({ push: mockPush });

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

        await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1));

        expect(mockPush).toHaveBeenCalledWith(url);
      });

      test('redirects via location if useRouter fails', async () => {
        const mockPush = jest.fn().mockImplementationOnce(() => {
          throw new Error('error');
        });

        createUseRouterMock({ push: mockPush });

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

        await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1));

        expect(window.location.assign).toHaveBeenCalledTimes(1);
        expect(window.location.assign).toHaveBeenCalledWith(url);
      });
    });
  });
});
