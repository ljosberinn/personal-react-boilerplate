import React from 'react';
import classnames from 'classnames';
import Icon from './Icon';

/**
 *
 * @see https://buefy.org/documentation/loading
 * @see https://github.com/buefy/buefy/blob/dev/src/components/loading/Loading.vue
 *
 * @param {{
 * isFullPage: boolean,
 * icon?: import('@fortawesome/free-solid-svg-icons').IconDefinition,
 * color?: 'light' | 'dark'
 * }}
 */
export default function Loader({ icon, isFullPage = false }) {
  return (
    <div
      className={classnames([
        'loading-overlay',
        'is-active',
        isFullPage && 'is-full-page',
      ])}
    >
      <div className="loading-background" />
      {icon ? (
        <Icon size="large" className="fa-3x fa-spin" icon={icon} />
      ) : (
        <div className="loading-icon" />
      )}
    </div>
  );
}
