import type { IncomingMessage, ServerResponse } from 'http';
import type { GetServerSidePropsContext } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { SESSION_COOKIE_NAME } from '../../../src/constants';
import {
  createIncomingRequestMock,
  createServerResponseMock,
} from '../../../testUtils/api';
import * as cookieUtils from '../../server/auth/cookie';
import { FOUND_MOVED_TEMPORARILY, UNAUTHORIZED } from '../../utils/statusCodes';
import type { User } from '../context/AuthContext/AuthContext';
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

interface CreateContextMockParam {
  query?: ParsedUrlQuery;
  req?: Partial<IncomingMessage>;
  res?: Partial<ServerResponse>;
}

const createContextMock = ({
  query = {},
  req = {},
  res = {},
}: CreateContextMockParam = {}): GetServerSidePropsContext => ({
  query: { ...query },
  req: createIncomingRequestMock(req),
  res: createServerResponseMock(res),
});

describe('withSession()', () => {
  test('calls getSession when no session is present', async () => {
    const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');
    const mockContext = createContextMock();

    const augmentedHandler = withSession(mockGetServerSideProps);
    const response = await augmentedHandler(mockContext);

    expect(getSessionSpy).toHaveBeenCalledWith(mockContext.req);

    expect(response).toMatchObject({
      props: {},
    });
  });

  test('given no session, bails with a redirect header & status', async () => {
    const mockContext = createContextMock();

    const augmentedHandler = withSession(mockGetServerSideProps);
    await augmentedHandler(mockContext);

    expect(mockContext.res.writeHead).toHaveBeenCalledWith(
      FOUND_MOVED_TEMPORARILY,
      expect.objectContaining({ Location: '/' })
    );
  });

  test('given no session, bails with given header & status', async () => {
    const mockContext = createContextMock();

    const augmentedHandler = withSession(mockGetServerSideProps, {
      headers: {},
      status: UNAUTHORIZED,
    });
    await augmentedHandler(mockContext);

    expect(mockContext.res.writeHead).toHaveBeenCalledWith(UNAUTHORIZED, {});
  });

  test('calls getSession when a session is present', async () => {
    const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');
    const fakeCookie = cookieUtils.encryptSession({});

    const mockContext = createContextMock({
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
