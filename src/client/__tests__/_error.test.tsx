import * as Sentry from '@sentry/minimal';
import { render } from '@testing-library/react';
import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';

import ErrorPage, { ErrorProps, getInitialProps } from '../../../pages/_error';
import { makeMockServerResponse } from '../../../testUtils/api';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from '../../utils/statusCodes';

const defaultProps: ErrorProps = {
  hasGetInitialPropsRun: false,
  statusCode: NOT_FOUND,
};

describe('<Error />', () => {
  it('reports to Sentry given an error', () => {
    const captureExceptionSpy = jest.spyOn(Sentry, 'captureException');

    const error = new Error('test');

    render(
      <ErrorPage
        {...defaultProps}
        statusCode={INTERNAL_SERVER_ERROR}
        err={error}
      />
    );

    expect(captureExceptionSpy).toHaveBeenCalledWith(error);
  });
});

describe('Error.getInitialProps()', () => {
  it('performs boot steps', async () => {
    const context: NextPageContext = {
      AppTree: () => null,
      pathname: '/',
      query: {},
    };

    const captureExceptionSpy = jest.spyOn(Sentry, 'captureException');
    const errorComponentSpy = jest.spyOn(NextErrorComponent, 'getInitialProps');

    const props = await getInitialProps(context);

    expect(errorComponentSpy).toHaveBeenCalledWith(context);
    expect(captureExceptionSpy).toHaveBeenCalledWith(expect.any(Error));

    expect(props).toMatchObject({
      hasGetInitialPropsRun: true,
      statusCode: NOT_FOUND,
    });

    captureExceptionSpy.mockClear();
  });

  it('omits props.hasGetInitialPropsRun given a statusCode in ctx.res', async () => {
    const context: NextPageContext = {
      AppTree: () => null,
      pathname: '/',
      query: {},
      res: makeMockServerResponse({ statusCode: NOT_FOUND }),
    };

    const captureExceptionSpy = jest.spyOn(Sentry, 'captureException');

    const props = await getInitialProps(context);

    expect(captureExceptionSpy).not.toHaveBeenCalled();

    expect(props).toMatchObject({
      statusCode: NOT_FOUND,
    });
  });

  it('reports initially passed error to Sentry', async () => {
    const context: NextPageContext = {
      AppTree: () => null,
      err: new Error('test'),
      pathname: '/',
      query: {},
      res: makeMockServerResponse({ statusCode: INTERNAL_SERVER_ERROR }),
    };

    const captureExceptionSpy = jest.spyOn(Sentry, 'captureException');

    const props = await getInitialProps(context);

    expect(captureExceptionSpy).toHaveBeenCalledWith(context.err);

    expect(props).toMatchObject({
      statusCode: INTERNAL_SERVER_ERROR,
    });
  });
});
