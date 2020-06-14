import * as Sentry from '@sentry/node';
import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  onErrorMessage?: JSX.Element;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = {
    errorEventId: undefined,
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error | null, errorInfo: ErrorInfo) {
    Sentry.withScope(scope => {
      scope.setTag('ssr', `${typeof window === 'undefined'}`);
      scope.setExtra('componentStack', errorInfo.componentStack);

      Sentry.captureException(error);
    });

    const errorEventId = Sentry.captureException(error);

    // Store the event id at this point as we don't have access to it within
    // `getDerivedStateFromError`.
    this.setState({ errorEventId });
  }

  showReportDialog = () => {
    // due to next.config.js, this is actually @sentry/browser which has that
    // method available
    // @ts-expect-error
    Sentry.showReportDialog({
      eventId: this.state.errorEventId,
    });
  };

  reload = () => {
    window.location.reload(true);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.onErrorMessage) {
        return this.props.onErrorMessage;
      }

      return (
        <section>
          <h1>There was an error!</h1>
          <p>
            <a href="#" onClick={this.showReportDialog}>
              <span role="img" aria-label="warning">
                📣
              </span>{' '}
              Report this error
            </a>
          </p>
          <p>
            <a href="#" onClick={this.reload}>
              Or, try reloading the page
            </a>
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
