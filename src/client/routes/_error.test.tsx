import * as Sentry from '@sentry/node';
import { render } from '@testing-library/react';
import { Socket } from 'net';
import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';

import ErrorPage, { ErrorProps, getInitialProps } from '../../../pages/_error';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from '../../utils/statusCodes';

const defaultProps: ErrorProps = {
  hasGetInitialPropsRun: false,
  statusCode: NOT_FOUND,
};

describe('<Error />', () => {
  it('renders without crashing given default props', () => {
    render(<ErrorPage {...defaultProps} />);
  });

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
      res: {
        _destroy: jest.fn(),
        _final: jest.fn(),
        _write: jest.fn(),
        _writev: jest.fn(),
        addListener: jest.fn(),
        addTrailers: jest.fn(),
        assignSocket: jest.fn(),
        chunkedEncoding: false,
        connection: new Socket(),
        cork: jest.fn(),
        destroy: jest.fn(),
        destroyed: false,
        detachSocket: jest.fn(),
        emit: jest.fn(),
        end: jest.fn(),
        eventNames: jest.fn(),
        finished: false,
        flushHeaders: jest.fn(),
        getHeader: jest.fn(),
        getHeaderNames: jest.fn(),
        getHeaders: jest.fn(),
        getMaxListeners: jest.fn(),
        hasHeader: jest.fn(),
        headersSent: false,
        listenerCount: jest.fn(),
        listeners: jest.fn(),
        off: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        pipe: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        rawListeners: jest.fn(),
        removeAllListeners: jest.fn(),
        removeHeader: jest.fn(),
        removeListener: jest.fn(),
        sendDate: false,
        setDefaultEncoding: jest.fn(),
        setHeader: jest.fn(),
        setMaxListeners: jest.fn(),
        setTimeout: jest.fn(),
        shouldKeepAlive: false,
        socket: new Socket(),
        statusCode: NOT_FOUND,
        statusMessage: '',
        uncork: jest.fn(),
        upgrading: false,
        useChunkedEncodingByDefault: false,
        writable: true,
        writableCorked: 0,
        writableEnded: false,
        writableFinished: false,
        writableHighWaterMark: 0,
        writableLength: 0,
        writableObjectMode: false,
        write: jest.fn(),
        writeContinue: jest.fn(),
        writeHead: jest.fn(),
        writeProcessing: jest.fn(),
      },
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
      res: {
        _destroy: jest.fn(),
        _final: jest.fn(),
        _write: jest.fn(),
        _writev: jest.fn(),
        addListener: jest.fn(),
        addTrailers: jest.fn(),
        assignSocket: jest.fn(),
        chunkedEncoding: false,
        connection: new Socket(),
        cork: jest.fn(),
        destroy: jest.fn(),
        destroyed: false,
        detachSocket: jest.fn(),
        emit: jest.fn(),
        end: jest.fn(),
        eventNames: jest.fn(),
        finished: false,
        flushHeaders: jest.fn(),
        getHeader: jest.fn(),
        getHeaderNames: jest.fn(),
        getHeaders: jest.fn(),
        getMaxListeners: jest.fn(),
        hasHeader: jest.fn(),
        headersSent: false,
        listenerCount: jest.fn(),
        listeners: jest.fn(),
        off: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        pipe: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        rawListeners: jest.fn(),
        removeAllListeners: jest.fn(),
        removeHeader: jest.fn(),
        removeListener: jest.fn(),
        sendDate: false,
        setDefaultEncoding: jest.fn(),
        setHeader: jest.fn(),
        setMaxListeners: jest.fn(),
        setTimeout: jest.fn(),
        shouldKeepAlive: false,
        socket: new Socket(),
        statusCode: INTERNAL_SERVER_ERROR,
        statusMessage: '',
        uncork: jest.fn(),
        upgrading: false,
        useChunkedEncodingByDefault: false,
        writable: true,
        writableCorked: 0,
        writableEnded: false,
        writableFinished: false,
        writableHighWaterMark: 0,
        writableLength: 0,
        writableObjectMode: false,
        write: jest.fn(),
        writeContinue: jest.fn(),
        writeHead: jest.fn(),
        writeProcessing: jest.fn(),
      },
    };

    const captureExceptionSpy = jest.spyOn(Sentry, 'captureException');

    const props = await getInitialProps(context);

    expect(captureExceptionSpy).toHaveBeenCalledWith(context.err);

    expect(props).toMatchObject({
      statusCode: INTERNAL_SERVER_ERROR,
    });
  });
});
