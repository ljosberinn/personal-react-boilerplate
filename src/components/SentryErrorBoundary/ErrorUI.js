import PropTypes from 'prop-types';
import { Message, Section, Button, Content, Generic, Title } from 'rbx';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { useTranslation } from 'react-i18next';
import { FaBomb, FaGithub } from 'react-icons/fa';

import { hasLocalStorage } from '../../constants/browserAPIs';
import { REPO_LINK, LOGROCKET_ID } from '../../constants/env';
import { useMediaQuery } from '../../hooks';
import Icon from '../Icon';
import styles from './ErrorUI.module.scss';

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
    } catch (error) {
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

export default function ErrorUI({ error }) {
  const { t } = useTranslation('error');
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <Section className={styles.container} aria-labelledby="section-title">
      <Fade triggerOnce direction={isMobile ? undefined : 'right'}>
        <Message color="danger" className={styles.message}>
          <Message.Body>
            <Title textColor="danger" id="section-title">
              <Icon size="large" svg={FaBomb} />
              {t('title')}
            </Title>
            <p>{t('boundaryInfo')}</p>

            <Content backgroundColor="white" className={styles.content}>
              <Generic italic as="code" textSize={7}>
                {error.stack
                  .split('\n')
                  .slice(0, MAX_STACK_LENGTH_SHOWN + 1)
                  .join('\n')}
              </Generic>
            </Content>

            <Button.Group>
              <Button color="primary" onClick={() => window.location.reload()}>
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
                  <Icon svg={FaGithub} /> <span>{t('openIssue')}</span>
                </Button>
              )}
            </Button.Group>
          </Message.Body>
        </Message>
      </Fade>
    </Section>
  );
}

ErrorUI.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
};
