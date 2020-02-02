import React, { Component } from 'react';
import {
  Column,
  Box,
  Container,
  Message,
  Section,
  Button,
  Modal,
  Content,
  Generic,
  Title,
} from 'rbx';
import { withTranslation } from 'react-i18next';
import { faBomb } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import * as Sentry from '@sentry/browser';
import { REPO_LINK, LOGROCKET_ID } from '../constants/env';
import { hasLocalStorage } from '../constants/browserAPIs';
import Icon from './Icon';
import styles from './SentryErrorBoundary.module.scss';

const logRocketUrl =
  'https://app.logrocket.com/__LR_ENV__/?filters=%255B%257B%2522type%2522%253A%2522userID%2522%252C%2522operator%2522%253A%257B%2522name%2522%253A%2522is%2522%252C%2522type%2522%253A%2522IS%2522%252C%2522hasStrings%2522%253Atrue%252C%2522autocompleteEnabled%2522%253Atrue%257D%252C%2522strings%2522%253A%255B%2522__LR_ID__%2522%255D%257D%255D';

/**
 *
 * @param {Error} error
 *
 * @returns {string} url
 */
const createGitHubIssueUrl = ({ name, message, stack }) => {
  const url = [REPO_LINK, 'issues', 'new'].join('/');

  const logRocketLink = (() => {
    if (!hasLocalStorage) {
      return false;
    }

    try {
      if (localStorage._lr_id_) {
        const lrJSON = JSON.parse(localStorage._lr_id_);

        if (lrJSON.userId) {
          const url = logRocketUrl
            .replace('__LR_ENV__', LOGROCKET_ID)
            .replace('__LR_ID__', lrJSON.userId);

          return `[LogRocket Link](${url})`;
        }

        return false;
      }

      return false;
    } catch (_) {
      return false;
    }
  })();

  const params = {
    title: [name, message].join(': '),
    body: logRocketLink ? [stack, logRocketLink].join('\n\n') : stack,
    labels: 'bug',
  };

  return [url, new URLSearchParams(params).toString()].join('?');
};

const MAX_STACK_LENGTH_SHOWN = 10;

class SentryErrorBoundary extends Component {
  state = {
    error: null,
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);

      this.setState({ error });
    });
  }

  render() {
    if (this.state.error) {
      const { t } = this.props;
      const { error } = this.state;

      return (
        <Section className="error-bg" aria-labelledby="section-title">
          <Container>
            <Column.Group centered>
              <Column size="one-third" narrow>
                <Box className="fade-in">
                  <Modal active>
                    <Modal.Background />
                    <Modal.Card className={styles.modal}>
                      <Modal.Card.Body className={styles.body}>
                        <Message color="danger" className={styles.message}>
                          <Message.Body>
                            <Title textColor="danger" id="section-title">
                              <Icon size="large" icon={faBomb} />
                              {t('title')}
                            </Title>
                            <p>{t('boundaryInfo')}</p>

                            <Content backgroundColor="white">
                              <Generic italic as="code" textSize={7}>
                                {error.stack
                                  .split('\n')
                                  .slice(0, MAX_STACK_LENGTH_SHOWN + 1)
                                  .join('\n')}
                              </Generic>
                            </Content>

                            <Button.Group>
                              <Button
                                color="primary"
                                onClick={() => window.location.reload()}
                              >
                                {t('reloadPage')}
                              </Button>

                              {REPO_LINK && (
                                <Button
                                  color="link"
                                  as="a"
                                  href={createGitHubIssueUrl(error)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Icon icon={faGithub} />{' '}
                                  <span>{t('openIssue')}</span>
                                </Button>
                              )}
                            </Button.Group>
                          </Message.Body>
                        </Message>
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

export default withTranslation('error')(SentryErrorBoundary);
