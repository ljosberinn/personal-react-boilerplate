import * as React from 'react';

import sentry from '../../../../utils/sentry';

const { Sentry, captureException } = sentry();

interface ErrorBoundaryProps {
  onErrorMessage?: JSX.Element;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
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

  showReportDialog = () => {
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
