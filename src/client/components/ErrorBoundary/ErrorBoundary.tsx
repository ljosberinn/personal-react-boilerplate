import React, { Component } from 'react';

import sentry from '../../../../utils/sentry';

const { Sentry, captureException } = sentry();

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
    errorEventId: undefined,
  };

  static getDerivedStateFromError() {
    // React Error Boundary here allows us to set state flagging the error (and
    // later render a fallback UI).
    return { hasError: true };
  }

  componentDidCatch(error: Error | null, errorInfo: object) {
    const errorEventId = captureException(error, { errorInfo });

    // Store the event id at this point as we don't have access to it within
    // `getDerivedStateFromError`.
    this.setState({ errorEventId });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section>
          <h1>There was an error!</h1>
          <p>
            <a
              href="#"
              onClick={() =>
                // @ts-ignore
                Sentry.showReportDialog({
                  eventId: this.state.errorEventId,
                })
              }
            >
              📣 Report this error
            </a>
          </p>
          <p>
            <a
              href="#"
              onClick={() => {
                window.location.reload(true);
              }}
            >
              Or, try reloading the page
            </a>
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
