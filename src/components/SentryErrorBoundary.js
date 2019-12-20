import React, { Component, Fragment } from 'react';
import {
  Column,
  Box,
  Container,
  Message,
  Section,
  Icon,
  Button,
  Modal,
  Content,
  Generic,
} from 'rbx';
import { withTranslation } from 'react-i18next';
import { faBomb } from '@fortawesome/free-solid-svg-icons';
import * as Sentry from '@sentry/browser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { modal, body, message } from './SentryErrorBoundary.module.scss';

const MAX_STACK_LENGTH_SHOWN = 10;

class SentryErrorBoundary extends Component {
  state = {
    error: null,
    eventId: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);

      const eventId = Sentry.captureException(error);
      this.setState({ eventId, error });
    });
  }

  showReportDialog = () => {
    Sentry.showReportDialog({
      eventId: this.state.eventId,
      lang: this.props.i18n.language,
    });
  };

  render() {
    if (this.state.error) {
      return (
        <Section className="error-bg">
          <Container>
            <Column.Group centered>
              <Column size="one-third" narrow>
                <Box className="fade-in">
                  <Modal active>
                    <Modal.Background />
                    <Modal.Card className={modal}>
                      <Modal.Card.Body className={body}>
                        <Content>
                          <Message color="danger" className={message}>
                            <Message.Body>
                              <Column.Group>
                                <Column size={1}>
                                  <Icon size="large">
                                    <FontAwesomeIcon icon={faBomb} />
                                  </Icon>
                                </Column>
                                <Column>
                                  <p>
                                    Yeah that... that shouldn't have happened.
                                    Gladly our team already received an error
                                    report.
                                  </p>

                                  <br />

                                  <Content backgroundColor="white">
                                    <Generic
                                      italic
                                      as="code"
                                      textSize={7}
                                      style={{ whiteSpace: 'pre' }}
                                    >
                                      {this.state.error.stack
                                        .split('\n')
                                        .slice(0, MAX_STACK_LENGTH_SHOWN + 1)
                                        .join('\n')}
                                    </Generic>
                                  </Content>

                                  <Button
                                    onClick={this.showReportDialog}
                                    color="primary"
                                  >
                                    Wanna help some more?
                                  </Button>
                                </Column>
                              </Column.Group>
                            </Message.Body>
                          </Message>
                        </Content>
                      </Modal.Card.Body>
                    </Modal.Card>
                  </Modal>
                </Box>
              </Column>
            </Column.Group>
          </Container>
        </Section>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(SentryErrorBoundary);
