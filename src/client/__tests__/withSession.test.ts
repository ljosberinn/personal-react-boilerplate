import { IncomingMessage, ServerResponse } from 'http';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import {
  makeMockIncomingRequest,
  makeMockServerResponse,
} from '../../../testUtils/api';
import { SESSION_COOKIE_NAME } from '../../constants';
import * as cookieUtils from '../../server/auth/cookie';
import { FOUND_MOVED_TEMPORARILY, UNAUTHORIZED } from '../../utils/statusCodes';
import { User } from '../context/AuthContext/AuthContext';
import { withSession } from '../utils/withSession';

const mockGetServerSideProps = jest
  .fn()
  .mockImplementation((_ctx: GetServerSidePropsContext, session: User) => {
    return {
      props: {
        session,
      },
    };
  });

interface MakeMockContextArgs {
  query?: ParsedUrlQuery;
  req?: Partial<IncomingMessage>;
  res?: Partial<ServerResponse>;
}

const makeMockContext = ({
  query = {},
  req = {},
  res = {},
}: MakeMockContextArgs = {}): GetServerSidePropsContext<ParsedUrlQuery> => ({
  query: { ...query },
  req: makeMockIncomingRequest(req),
  res: makeMockServerResponse(res),
});

describe('withSession()', () => {
  test('calls getSession when no session is present', async () => {
    const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');
    const mockContext = makeMockContext();

    const augmentedHandler = withSession(mockGetServerSideProps);
    const response = await augmentedHandler(mockContext);

    expect(getSessionSpy).toHaveBeenCalledWith(mockContext.req);

    expect(response).toMatchObject({
      props: {},
    });
  });

  test('given no session, bails with a redirect header & status', async () => {
    const mockContext = makeMockContext();

    const augmentedHandler = withSession(mockGetServerSideProps);
    await augmentedHandler(mockContext);

    expect(mockContext.res.writeHead).toHaveBeenCalledWith(
      FOUND_MOVED_TEMPORARILY,
      expect.objectContaining({ Location: '/' })
    );
  });

  test('given no session, bails with given header & status', async () => {
    const mockContext = makeMockContext();

    const augmentedHandler = withSession(mockGetServerSideProps, {
      headers: {},
      status: UNAUTHORIZED,
    });
    await augmentedHandler(mockContext);

    expect(mockContext.res.writeHead).toHaveBeenCalledWith(UNAUTHORIZED, {});
  });

  test('calls getSession when a session is present', async () => {
    const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');
    const fakeCookie = await cookieUtils.encryptSession({});

    const mockContext = makeMockContext({
      req: {
        headers: {
          cookie: [SESSION_COOKIE_NAME, fakeCookie].join('='),
        },
      },
    });

    const augmentedHandler = withSession(mockGetServerSideProps);

    const response = await augmentedHandler(mockContext);

    expect(getSessionSpy).toHaveBeenCalledWith(mockContext.req);

    expect(mockContext.res.writeHead).not.toHaveBeenCalled();

    expect(mockGetServerSideProps).toHaveBeenCalledWith(
      mockContext,
      expect.any(Object)
    );

    expect(response).toMatchObject({
      props: {
        session: expect.any(Object),
      },
    });
  });
});
